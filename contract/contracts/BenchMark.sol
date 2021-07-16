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

    struct Benchmark {
        bytes32 name;
        uint256 entries;
        bytes32 description;
        uint256 upper_bound;
        uint256 lower_bound;
        bytes32 unit;
        uint256 n;
        uint256 nSquared;
        uint256 g;
        uint256 lambda;
        uint256 mu;
        uint256 sum;
    }

    address public initiator;

    mapping(address => Benchmarkee) public Benchmarkees;

    Benchmark public benchmark;

    event AggregateReady(bytes32 indexed benchmarkName, uint256 entryCount);


    constructor(
        bytes32 benchmarkName,
        uint256 lowerBound,
        uint256 upperBound,
        bytes32 benchmarkUnit,
        bytes32 benchmarkDescription,
        uint256 en,
        uint256 eg,
        uint256 enSquared,
        uint256 elambda,
        uint256 emu,
        uint256 zero
    ) {
        initiator = msg.sender;

        require(upperBound >= 0, "Upper bound has to be greater than zero");
        require(lowerBound >= 0, "Lower bound has to be greater than zero");

        benchmark = Benchmark({
            name: benchmarkName,
            entries: 0,
            upper_bound: upperBound,
            lower_bound: lowerBound,
            unit: benchmarkUnit,
            description: benchmarkDescription,
            n: en,
            g: eg,
            nSquared: enSquared,
            lambda: elambda,
            mu: emu,
            sum: zero
        });
    }

    function participate(uint256 contribution) public {
        Benchmarkee storage sender = Benchmarkees[msg.sender];
        require(!sender.participated, "Already participated.");
        sender.participated = true;

        require(
            contribution >= benchmark.lower_bound,
            "Value is below lower bound"
        );
        /*
        require(
            _contribution <= benchmark.upper_bound,
            "Value is above upper bound"
        );
        */


        homomorphicAdd(contribution);
        benchmark.entries += 1;
        sender.contribution = contribution;

        if (benchmark.entries >= 3) {
            emit AggregateReady(benchmark.name, benchmark.entries);
        }
        
    }

    function homomorphicAdd(uint256 encryptedChange) private {
        uint256 encryptedBalanceInner = benchmark.sum;
        uint256 nSquaredInner = benchmark.nSquared;
        uint256 encryptedBalanceTemp;
        assembly {
            let _encryptedBalance := encryptedBalanceInner
            let _encryptedChange := encryptedChange
            let _nSquared := nSquaredInner
            encryptedBalanceTemp := mulmod(
                _encryptedBalance,
                _encryptedChange,
                _nSquared
            )
        }
        benchmark.sum = encryptedBalanceTemp;
    } 
}
