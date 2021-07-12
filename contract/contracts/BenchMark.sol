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
        bytes32 description;
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
        bytes32 benchmarkUnit,
        bytes32 benchmarkDescription
    ) {
        initiator = msg.sender;

        require(upperBound >= 0, "Upperbound has to be grater than zero");
        require(lowerBound >= 0, "Lowerbound has to be grater than zero");

        uint256 zero = 0;

        benchmark = Benchmark({
            name: benchmarkName,
            entries: 0,
            sum: zero.fromUint(),
            upper_bound: upperBound,
            lower_bound: lowerBound,
            unit: benchmarkUnit,
            description: benchmarkDescription
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
      uint256 r = this.unsignedDiv(x.fromUint(), hundred.fromUint());
      result = this.unsignedMul(y, r);
    }

    function getStars(
        uint256 value,
        uint256 referenceValue,
        bool isBest
    ) view internal returns (uint256) {
        uint256 halb = percentage(50, referenceValue);
        uint256 viertel = percentage(25, referenceValue);
        uint256 dreiviertel = percentage(75, referenceValue);

        if (isBest) {
            if (value == referenceValue) {
                return 5;
            } else if (value < referenceValue && value >= dreiviertel) {
                return 4;
            } else if (value < dreiviertel && value >= halb) {
                return 3;
            } else if (value < halb && value >= viertel) {
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

            if (value == referenceValue) {
                return 5;
            } else if (value < referenceValue && value > dreiviertel) {
                return 5;
            } else if (value < dreiviertel && value > halb) {
                return 4;
            } else if (value < halb && value > viertel) {
                return 3;
            } else if (value < viertel && value > minushalb) {
                return 2;
            } else if (value < minushalb) {
                return 1;
            } else if (value > referenceValue && value < plusviertel) {
                return 5;
            } else if (value > plusviertel && value < plushalb) {
                return 4;
            } else if (value > plushalb && value < plusdreiviertel) {
                return 3;
            } else if (value > plusdreiviertel && value < plushundert) {
                return 2;
            } else {
                return 1;
            }
        }
    }

    function emitAdvertisement() private {
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
        benchmark.sum += contribution;
        benchmark.entries += 1;
        sender.contribution = contribution;

        emitAdvertisement();

        if(contribution > best){
            best = contribution;
        }
    }

    

    function average() public view returns (uint256 average_) {
        require(benchmark.entries >= 3, "Not enough people have participated");

        average_ = benchmark.sum.div(benchmark.entries.fromUint());
    }

    function bestRating(uint256 contribution) public view returns (uint rating_){
        require(benchmark.entries >= 3, "Not enough people have participated");

        rating_ = getStars(contribution, best, true);
    }

    function averageRating(uint256 contribution) public view returns (uint rating_){
        require(benchmark.entries >= 3, "Not enough people have participated");

        rating_ = getStars(contribution, this.average(), false);
    }
}
