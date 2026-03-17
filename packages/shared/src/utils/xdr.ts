import { xdr, Address } from '@stellar/stellar-sdk';

/**
 * Decodes a Soroban XDR ScVal into a human-readable format.
 */
export function decodeScVal(scVal: xdr.ScVal): any {
  switch (scVal.switch()) {
    case xdr.ScValType.scvBool():
      return scVal.b();
    case xdr.ScValType.scvVoid():
      return null;
    case xdr.ScValType.scvI32():
      return scVal.i32();
    case xdr.ScValType.scvU32():
      return scVal.u32();
    case xdr.ScValType.scvI64():
      return scVal.i64().toBigInt();
    case xdr.ScValType.scvU64():
      return scVal.u64().toBigInt();
    case xdr.ScValType.scvString():
      return scVal.str().toString();
    case xdr.ScValType.scvSymbol():
      return scVal.sym().toString();
    case xdr.ScValType.scvAddress():
      return Address.account(scVal.address().accountId().ed25519()).toString();
    case xdr.ScValType.scvVec():
      return scVal.vec()?.map(decodeScVal) || [];
    case xdr.ScValType.scvMap():
      return scVal.map()?.map((entry) => ({
        key: decodeScVal(entry.key()),
        val: decodeScVal(entry.val()),
      })) || [];
    default:
      return scVal.toXDR('base64');
  }
}
