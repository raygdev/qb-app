import { Request, Response } from "express";
import { Customer } from "../../models/quickbooks-customer";



export const getCustomer = async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params

  const customer = await Customer.findById(id)

  if(!customer) {
    res.status(404).send('Not Found')
    return;
  }

  res.send(customer)
}