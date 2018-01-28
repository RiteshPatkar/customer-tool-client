export class BankArrayDataModel {
  banks: BankDataModel[];
}

export class BankDataModel {
  bankCode = '';
  description = '';
  interCompany = 0;
  dealIntermediary = 0;
  dealCounterPart = 0;
}
