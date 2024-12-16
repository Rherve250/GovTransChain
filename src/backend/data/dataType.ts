import { Record, text, Variant , nat64, nat, Vec, Principal } from "azle/experimental";





// Profile datatype

export const AddressProp = Record({
    Province: text,
    District: text,
    Sector: text,
    Cell: text
  });
export type AddressProp = typeof AddressProp.tsType

export const RoleEnum = Variant({
    HIGH_OFFICIAL: text,
    LOCAL_LEADER: text,
    CITIZEN: text
  });

export type RoleEnum = typeof RoleEnum.tsType

export const UserProfile = Record({
    ProfileId: text,
    Fullname: text,
    DateOfBirthday: text,
    Gender: text,
    NationalId: nat64,
    Email: text,
    Phone: text,
    ProgramsJoined: Vec(text),
    Address: AddressProp,
    Role: RoleEnum,
    Owner: Principal,
    CreatedAt: text,
    UpdatedAt: text
  });

export type UserProfile = typeof UserProfile.tsType

export  const UserProfileDisplay = Record({
    ProfileId: text,
    Fullname: text,
    DateOfBirthday: text,
    Gender: text,
    NationalId: nat64,
    Email: text,
    Phone: text,
    ProgramsJoined: Vec(text),
    Address: AddressProp,
    Role: RoleEnum,
    CreatedAt: text,
    UpdatedAt: text
  })

export type UserProfileDisplay = typeof UserProfileDisplay.tsType

export  const UserProfilePayload = Record({
    Fullname: text,
    DateOfBirthday:text,
    Gender: text,
    NationalId: nat64,
    Email: text,
    Phone: text,
    Address: AddressProp,
  })
export type UserProfilePayload = typeof UserProfilePayload.tsType

export  const ChangeRoleProps = Record({
    ProfileId: text,
    Role: text
  })
export type ChangeRoleProps = typeof ChangeRoleProps.tsType


  // Program  dataType

export const Program = Record({
    ProgramId: text,
    Name: text,
    CreatedBy: Principal,
    LocalLeaders: Vec(text),
    RequestCitizens: Vec(text),
    Citizens: Vec(text),
    Beneficials: text,
    Description: text,
    CreatedAt: text,
    UpdatedAt: text,
    
});

export type Program = typeof Program.tsType

export const DisplayProgram = Record({
  ProgramId: text,
  Name: text,
  LocalLeaders: Vec(text),
  RequestCitizens: Vec(text),
  Citizens: Vec(text),
  Beneficials: text,
  Description: text,
  CreatedAt: text,
  UpdatedAt: text,
})
export type DisplayProgram  = typeof DisplayProgram.tsType

export const ProgramPayload = Record({
  Name: text,
  Beneficials: text,
  Description: text
});

export type ProgramPayload = typeof ProgramPayload.tsType


// Stock datatype

export const Stock= Record({
    StockId: text,
    ProgramId: text,
    StockName: text,
    Quantity: text,
    RemainingStock: text,
    CreatedBy: Principal,
    CreatedAt: text,
    UpdatedAt: text 
});
export type Stock = typeof Stock.tsType

export const StoreObject = Record({
  StockId :text,
  ProgramId: text,
  StockName: text,
  Quantity: text
})
export type StoreObject = typeof  StoreObject.tsType

export const Store = Record({
  stores: Vec(StoreObject)
})
export type Store  = typeof Store.tsType

export const StockPayload = Record({
  ProgramId: text,
  StockName: text,
  Quantity: text,
})

export type StockPayload = typeof StockPayload.tsType


// Transaction datatype

export const TransactionEnum = Variant({
    TRANSFER: text,
    DISTRIBUTE: text
});

export type TransactionEnum = typeof TransactionEnum.tsType

export const TransactionStatus = Variant({
    ACCEPTED: text,
    REJECT: text,
    PENDING: text
})

export type TransactionStatus = typeof TransactionStatus.tsType

export const StockTransactions = Record({
    TransactionId: text,
    StockId: text,
    SenderId: text,
    ReceiverId: text,
    Quantity: text,
    TransactionType: TransactionEnum,
    Status: TransactionStatus,
    CreatedAt: text
})

export type StockTransactions = typeof StockTransactions.tsType

export const StockTransactionsProp = Record({
  StockId: text,
  ReceiverId: text,
  Quantity: text
})

export type StockTransactionsProp = typeof StockTransactionsProp.tsType

// Message datatype

export const Message = Variant({
  NotFound: text,
  InvalidPayload: text,
  Error: text,
  NoProfile: text,
 Unauthorized: text
})

export type Message = typeof Message.tsType

export const ProgramStat=Record({
  totalProgram: nat,
  totalEnrolled: nat,
  totalBenefecials:nat
})
export type ProgramStat = typeof ProgramStat.tsType
export const StockStat=Record({
  totalStock: nat,
  totalQuantity: nat,
  totalRemaining:nat
})

export type StockStat = typeof Stock.tsType

export const ProfileStatProp=Record({
  Role: text,
  count: text
})

export type ProfileStatProp = typeof ProfileStatProp.tsType