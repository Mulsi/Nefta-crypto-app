import { FormControl } from '@angular/forms';
export class Validator {
  public static RecipientAddressValidator(control: FormControl) {
    const address = control.value;
    const regex = /^0x[a-fA-F0-9]{40}$/g;

    if (!regex.test(address)) {
      return { invalidRecipientAddress: true };
    }
    return null;
  }
}
