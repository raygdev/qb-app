import { Request, Response } from "express";
import { Customer } from "../../models/quickbooks-customer";

export const getCustomers = async (req: Request<{ realmId: string }>, res: Response) => {
  /**
   * @todo change to requesting user realm id
   */

  const { realmId } = req.params

  const customers = await Customer.find({ realmId })

  if(!customers) {
    res.status(404).send('Not Found')
    return;
  }

  res.status(200).json({ customers })
}