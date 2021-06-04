/*
SPDX-License-Identifier: MIT
*/

pragma solidity >=0.8.0;

contract BenchMark {
    struct Benchmarkee {
        bool participated;
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

    address public initiator;

    mapping(address => Benchmarkee) public Benchmarkees;

    Benchmark public benchmark;

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

    function participate(uint256 contribution) public {
        Benchmarkee storage sender = Benchmarkees[msg.sender];
        // require(!sender.participated, "Already participated.");
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
    }

    function average() public view returns (uint256 average_) {
        // https://ethereum.stackexchange.com/a/52564
        // Use precision of five for now
        require(benchmark.entries >= 3, "Not enough people have voted yet");

        average_ = (benchmark.sum * (10**5)) / benchmark.entries;
    }
}
