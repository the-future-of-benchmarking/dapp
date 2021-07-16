// ((c^lambda mod nSquared)-1)/n) * (lambda mod n)
let decryptedTemp;

let _c = 3616240799286812471n;
let _lambda = 74421272n;
let _nSquared = 12311315540134141n;
let _n = 142255165n;

// modPow(c, this.lambda, this.publicKey._n2)
console.log(0)
let expo = _c ** _lambda;
console.log(1)
let cLambda = expo % _nSquared;
console.log(2)
let lamm = cLambda - 1;
console.log(3)
let multf = lamm / _n;
console.log(4)
let mult = _lambda % _n;
console.log(5)
decryptedTemp = multf * mult;
console.log(6)
console.log(decryptedTemp);
