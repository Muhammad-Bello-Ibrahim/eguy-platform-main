import { MdAccountCircle, MdPerson, MdVisibilityOff, MdAddCircle, MdSmartphone, MdWifi, MdDescription, MdAssignment, MdGroupAdd, MdShare, MdPayment, MdReceiptLong, MdCall, MdLightbulb, MdSchool, MdCreditCard } from "react-icons/md";



import { IconBaseProps } from "react-icons";

export const ProfileIcon = (props: IconBaseProps) => <MdAccountCircle {...props} color="#388e3c" />;
export const EyeOffIcon = (props: IconBaseProps) => <MdVisibilityOff {...props} color="#757575" />;
export const AddMoneyIcon = (props: IconBaseProps) => <MdAddCircle {...props} color="#fff" />;
export const AirtimeIcon = (props: IconBaseProps) => <MdCall {...props} color="#1976d2" />;
export const DataIcon = (props: IconBaseProps) => <MdWifi {...props} color="#0288d1" />;
export const ElectricityIcon = (props: IconBaseProps) => <MdLightbulb {...props} color="#FF3B30" />;
export const CableIcon = (props: IconBaseProps) => <MdCreditCard {...props} color="#8e24aa" />;
export const ExamPinIcon = (props: IconBaseProps) => <MdCreditCard {...props} color="#fbc02d" />;
export const ReferEarnIcon = (props: IconBaseProps) => <MdGroupAdd {...props} color="#d81b60" />;
export const TransactionAirtimeIcon = (props: IconBaseProps) => <MdCall {...props} color="#1976d2" />;
export const TransactionDataIcon = (props: IconBaseProps) => <MdWifi {...props} color="#0288d1" />;
export const TransactionElectricityIcon = (props: IconBaseProps) => <MdLightbulb {...props} color="#FF3B30" />;
export const TransactionOtherIcon = (props: IconBaseProps) => <MdPayment {...props} color="#616161" />;
export const TransactionReceiptIcon = (props: IconBaseProps) => <MdReceiptLong {...props} color="#616161" />;
export const TransactionCallIcon = (props: IconBaseProps) => <MdCall {...props} color="#1976d2" />;
