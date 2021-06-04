# Simple Benchmarking Contract
Illustrates a pretty basic benchmarking contract.
Beware of the inbuilt 5 digit prezition behind the comma when calculating the average.

The contract uses an upper and lower bound to validate the entry. Additionally the deploying party may choose an unit (i.e. Mio. €).
The benchmarkees are deduplicated (one entry per benchmarkee).
The benchmarkees are only pseudonymized by their address. Their entry is clearly visible via any Blockchain explorer.
The sum is queriable after the 3rd entry at the moment.

The Typescript "Client" is intended for Node.JS usage and proofs at the moment, that connectivity is possible and that the average with multiple account via smart contract matches the locally calculated average.