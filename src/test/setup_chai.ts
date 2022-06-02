import Chai from "chai";
import ChaiAsPromised from "chai-as-promised";
import DeepEqualInAnyOrder from "deep-equal-in-any-order";
import SinonChai from "sinon-chai";

// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
Chai.use(DeepEqualInAnyOrder);
// Chai.use(ChaiLike);
// Chai.use(ChaiThings);
Chai.use(SinonChai);
Chai.use(ChaiAsPromised);
