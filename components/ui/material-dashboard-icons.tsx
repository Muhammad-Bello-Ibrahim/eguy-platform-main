import { MdAccountCircle, MdPerson, MdVisibilityOff, MdAddCircle, MdSmartphone, MdWifi, MdDescription, MdAssignment, MdGroupAdd, MdShare, MdPayment, MdReceiptLong, MdCall, MdLightbulb, MdSchool, MdCreditCard } from "react-icons/md";



import { IconBaseProps } from "react-icons";

export const ProfileIcon = (props: IconBaseProps) => <MdAccountCircle {...props} />;
export const EyeOffIcon = (props: IconBaseProps) => <MdVisibilityOff {...props} />;
export const AddMoneyIcon = (props: IconBaseProps) => <MdAddCircle {...props} />;
export const AirtimeIcon = (props: IconBaseProps) => <MdCall {...props} />;
export const DataIcon = (props: IconBaseProps) => <MdWifi {...props} />;
export const ElectricityIcon = (props: IconBaseProps) => <MdLightbulb {...props} />;
export const CableIcon = (props: IconBaseProps) => <MdCreditCard {...props} />;
export const ExamPinIcon = (props: IconBaseProps) => <MdCreditCard {...props} />;
export const ReferEarnIcon = (props: IconBaseProps) => <MdGroupAdd {...props} />;
export const TransactionAirtimeIcon = (props: IconBaseProps) => <MdCall {...props} color="#1976d2" />;
export const TransactionDataIcon = (props: IconBaseProps) => <MdWifi {...props} color="#0288d1" />;
export const TransactionElectricityIcon = (props: IconBaseProps) => <MdLightbulb {...props} color="#FF3B30" />;
export const TransactionOtherIcon = (props: IconBaseProps) => <MdPayment {...props} color="#616161" />;
export const TransactionReceiptIcon = (props: IconBaseProps) => <MdReceiptLong {...props} color="#616161" />;
export const TransactionCallIcon = (props: IconBaseProps) => <MdCall {...props} color="#1976d2" />;
