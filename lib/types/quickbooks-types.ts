export interface QuickBooksTokensResponse {
    id_token: string,
    expires_in: number,
    token_type: string,
    access_token: string,
    refresh_token: string,
    x_refresh_token_expires_in: number,
    realmId: string 
}
 
export interface QuickBooksRevokedTokenResponse {
     revoke: boolean;
     message: string,
     token: string,
     status: number
}
 
export interface QuickBooksJwksResponse {
     keys: [ { kid: string }]
}

export interface QuickBooksInvoiceResponse {
    Invoice: {
        AllowIPNPayment: boolean
        AllowOnlinePayment: boolean,
        AllowOnlineCreditCardPayment: boolean,
        AllowOnlineACHPayment: boolean,
        InvoiceLink: string
        domain: string,
        sparse: boolean,
        Id: string,
        SyncToken: string,
        MetaData: {
          CreateTime: string,
          LastModifiedReg: {
            value: string
          },
        LastUpdatedTime: string
        },
        CustomField: [],
        DocNumber: string,
        TxnDate: string,
        CurrencyRef: {
          value: string,
          name: string
        },
        LinkedTxn: LinkedTxn[],
        Line: Line[],
        TxnTaxDetail: {
            TxnTaxCodeRef: {
              value: string
            },
            TotalTax: number,
            TaxLine: TaxLine[]
        },
        CustomerRef: {
          value: string,
          name: string
        },
        CustomerMemo: {
          value: string
        },
        BillAddr: Address,
        ShipAddr: Address,
        FreeFormAddress: boolean,
        SalesTermRef: {
          value: string,
          name: string
        },
        DueDate: string,
        TotalAmt: number,
        ApplyTaxAfterDiscount: boolean,
        PrintStatus: string,
        EmailStatus: string,
        BillEmail: {
          Address: string
        },
        Balance: number
    },
    time: string
}

interface LinkedTxn {
    TxnId: string,
    TxnType: string
}

interface Address {
  Id: string,
  [key: `Line${number}`]: string,
  Lat: string,
  Long: string 
}

interface SalesItemLine {
    Id: string,
    LineNum: number,
    Description: string,
    Amount: number,
    DetailType: "SalesItemLineDetail",
    SalesItemLineDetail: {
        ItemRef: {
            value: string,
            name: string
        },
        UnitPrice: number,
        Qty: number,
        ItemAccountRef: {
            value: string,
            name: string
        },
        TaxCodeRef: {
            value: string
        }
    }
}

interface SubtotalLineDetail {
    GroupReference?: string,
    Description?: string,
    [key: string]: unknown
}

interface SubtotalLine {
  Amount: number,
  DetailType: "SubtotalLineDetail",
  SubtotalLineDetail: SubtotalLineDetail
}

interface TaxLine {
  Amount: number,
  DetailType: string,
  TaxLineDetail: {
    TaxRateRef: {
      value: string
    },
    PercentBased: boolean,
    TaxPercent: number,
    NetAmountTaxable: number
  }
}

type Line = SalesItemLine | SubtotalLine

export interface QuickBooksPaymentResponse {
    Payment: {
      SyncToken: string,
      domain: string,
      DepositToAccountRef: {
        value: string
      },
      UnappliedAmount: number,
      TxnDate: string,
      TotalAmt: number,
      ProjectRef: {
        value: string
      },
      ProcessPayment: boolean,
      sparse: boolean,
      Line: PaymentLine[],
      CustomerRef: {
        name: string,
        value: string
      },
      Id: string,
      MetaData: {
        CreateTime: string,
        LastUpdateTime: string
      }
    },
    time: string
  }


  interface PaymentLine {
    Amount: number,
    LineEx: {
        any: PaymentLineExAny[]
    }, 
    LinkedTxn: [
      {
        TxnId: string,
        TxnType: LinkedTxnType
      }
    ]
}

type LinkedTxnType = 'Invoice' | 'CreditMemo' | 'SalesReceipt' | 'Payment' | 'JournalEntry'

interface PaymentLineExAny {
  name: string, 
  nil: boolean, 
  value: {
    Name: string, 
    Value: string
  }, 
  declaredType: string, 
  scope: string, 
  globalScope: boolean, 
  typeSubstituted: boolean
}

type QuickBooksEventEntitiesNameTypes = 'Invoice'
| 'Payment'
| 'Customer'
| 'Bill'
| 'Vendor'
| 'Employee'
| 'Item'
| 'CreditMemo'
| 'Purchase'
| 'SalesReceipt'
| 'JournalEntry'
| 'Estimate'
| 'TimeActivity'
| 'Deposit'
| 'Transfer'
| 'TaxRate'
| 'Account'
| 'RefundReceipt'
| 'PurchaseOrder'
| 'TaxAgency'

export interface QuickBooksDataChangeEvent {
  eventNotifications: [{
    realmId: string,
    dataChangeEvent: {
      entities: [{
        name: QuickBooksEventEntitiesNameTypes,
        id: string,
        operation: string
        lastUpdated: string
      }]
    }
  }]
}

export interface CustomerListQuery {
  QueryResponse: {
    Customer: [
      {
        Taxable: boolean,
        BillAddr: BillableAddress,
        ShipAddr: BillableAddress,
        Job: boolean,
        BillWithParent: boolean,
        Balance: number,
        BalanceWithJobs: number,
        CurrencyRef: {
          value: string,
          name: string
        },
        PreferredDeliveryMethod: string,
        IsProject: boolean,
        ClientEntityId: `${number}`,
        domain: string,
        sparse: boolean,
        Id: `${number}`,
        SyncToken: `${number}`,
        MetaData: {
          CreateTime: Date,
          LastUpdatedTime: Date
        },
        GivenName: string,
        FamilyName: string,
        FullyQualifiedName: string,
        CompanyName: string,
        DisplayName: string,
        PrintOnCheckName: string,
        Active: boolean,
        V4IDPseudonym: string,
        PrimaryPhone: {
          FreeFormNumber: `(${number}) ${number}-${number}`
        },
        PrimaryEmailAddr: {
          Address: string
        }
      }
    ],
    startPosition: number,
    maxResults: number
  },
  time: Date
}

interface BillableAddress {
  Id: `${number}`,
  Line1: string,
  City: string,
  CountrySubDivisionCode: String,
  PostalCode: `${number}`,
  Lat: `${number}`,
  Long: `${number}`
}