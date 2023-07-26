import { err } from "neverthrow";
import { IError } from "../../core/exceptions/error.exception";
import { Store } from "../domain/store";
import { StoreRepository } from "../domain/repositories/store.repository";
import { StoreResult } from "../domain/types/storeResult.type";
import Model from "./models/store.model";

export class StoreInfraestructure implements StoreRepository {
  async save(store: Store): Promise<StoreResult> {
    try {
      await Model.create(store);
    } catch (error) {
      const resultErr = new IError(error.message);
      resultErr.status = 500;
      return err(resultErr);
    }
  }
}
