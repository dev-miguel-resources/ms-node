import { Store } from "../store";
import { StoreResult } from "../types/storeResult.type";

export interface StoreRepository {
  save(store: Store): Promise<StoreResult>;
}
