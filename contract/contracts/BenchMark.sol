/*
SPDX-License-Identifier: MIT
*/

pragma solidity >=0.8.0;
import "prb-math/contracts/PRBMathUD60x18.sol";

contract BenchMark {

    using PRBMathUD60x18 for uint256;

    struct Benchmarkee {
        bool participated;
        uint256 contribution;
    }

    // This is a type for a single proposal.
    struct Benchmark {
        bytes32 name;
        uint256 entries;
        uint256 sum;
        uint256 upper_bound;
        uint256 lower_bound;
        bytes32 unit;
    }

    uint private best;

    address public initiator;

    mapping(address => Benchmarkee) public Benchmarkees;

    Benchmark public benchmark;

    event AggregateReady(bytes32 indexed benchmarkName, uint256 entryCount);

    

    /// Create a new ballot to choose one of `proposalNames`.
    constructor(
        bytes32 benchmarkName,
        uint256 lowerBound,
        uint256 upperBound,
        bytes32 benchmarkUnit
    ) {
        initiator = msg.sender;

        require(upperBound >= 0, "Value mismatch");
        require(lowerBound >= 0, "Value mismatch");

        benchmark = Benchmark({
            name: benchmarkName,
            entries: 0,
            sum: 0,
            upper_bound: upperBound,
            lower_bound: lowerBound,
            unit: benchmarkUnit
        });
    }

    function unsignedMul(uint256 x, uint256 y) external pure returns (uint256 result) {
        result = x.mul(y);
    }

    function unsignedDiv(uint256 x, uint256 y) external pure returns (uint256 result) {
        result = x.div(y);
    }

    function percentage(uint256 x, uint256 y) internal view returns (uint256 result) {
        uint256 hundred = 100;
      uint256 r = this.unsignedDiv(x, hundred.fromUint());
      result = this.unsignedMul(y, r);
    }

    function getStars(
        uint256 value,
        uint256 referenceValue,
        bool isBest
    ) view internal returns (uint256) {
        uint256 halb = percentage(50, referenceValue);
        uint256 viertel = percentage(25, referenceValue);
        uint256 internalValue = value.fromUint();
        uint256 dreiviertel = percentage(75, referenceValue);

        

        if (isBest) {
            if (internalValue == referenceValue) {
                return 5;
            } else if (internalValue < referenceValue && internalValue >= dreiviertel) {
                return 4;
            } else if (internalValue < dreiviertel && internalValue >= halb) {
                return 3;
            } else if (internalValue < halb && internalValue >= viertel) {
                return 2;
            } else {
                return 1;
            }
        } else {
            uint256 minushalb = percentage(1, referenceValue);
            uint256 plusviertel = percentage(125, referenceValue);
            uint256 plushalb = percentage(150, referenceValue);
            uint256 plusdreiviertel = percentage(175, referenceValue);
            uint256 plushundert = percentage(200, referenceValue);

            if (internalValue == referenceValue) {
                return 5;
            } else if (internalValue < referenceValue && internalValue > dreiviertel) {
                return 5;
            } else if (internalValue < dreiviertel && internalValue > halb) {
                return 4;
            } else if (internalValue < halb && internalValue > viertel) {
                return 3;
            } else if (internalValue < viertel && internalValue > minushalb) {
                return 2;
            } else if (internalValue < minushalb) {
                return 1;
            } else if (internalValue > referenceValue && internalValue < plusviertel) {
                return 5;
            } else if (internalValue > plusviertel && internalValue < plushalb) {
                return 4;
            } else if (internalValue > plushalb && internalValue < plusdreiviertel) {
                return 3;
            } else if (internalValue > plusdreiviertel && internalValue < plushundert) {
                return 2;
            } else {
                return 1;
            }
        }
    }

    function emitAdvertisement() internal {
        if(benchmark.entries >= 3){
            emit AggregateReady(benchmark.name, benchmark.entries);
        }
    }

    function participate(uint256 contribution) public {
        Benchmarkee storage sender = Benchmarkees[msg.sender];
        require(!sender.participated, "Already participated.");
        sender.participated = true;

        require(
            contribution >= benchmark.lower_bound,
            "Value is below lower bound"
        );
        require(
            contribution <= benchmark.upper_bound,
            "Value is above upper bound"
        );

        // If `proposal` is out of the range of the array,
        // this will throw automatically and revert all
        // changes.
        benchmark.sum += contribution.fromUint();
        benchmark.entries += 1;
        sender.contribution = contribution.fromUint();

        emitAdvertisement();

        if(best == 0 || contribution > best){
            best = contribution;
        }
    }

    

    function average() external view returns (uint256 average_) {
        // https://ethereum.stackexchange.com/a/52564
        // Use precision of five for now
        Benchmarkee storage sender = Benchmarkees[msg.sender];

        require(sender.participated, "Not eligible, not participated");
        require(benchmark.entries >= 3, "Not enough people have participated");

        emitAdvertisement();

        average_ = benchmark.sum.div(benchmark.entries.fromUint());
    }

    function bestRating() external view returns (uint rating_){
        Benchmarkee storage sender = Benchmarkees[msg.sender];
        require(sender.participated, "Not eligible, not participated");
        require(benchmark.entries >= 3, "Not enough people have participated");

        emitAdvertisement();

        rating_ = getStars(sender.contribution, best, true);
    }

    function averageRating() external view returns (uint rating_){
        Benchmarkee storage sender = Benchmarkees[msg.sender];
        
        require(sender.participated, "Not eligible, not participated");
        require(benchmark.entries >= 3, "Not enough people have participated");

        emitAdvertisement();

        rating_ = getStars(sender.contribution, this.average(), false);
    }
}
