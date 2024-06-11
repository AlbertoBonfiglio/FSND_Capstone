export class Preference {
  key: string = '';
  value: any = ''; 
  required: boolean = false

  constructor(key:string, value:any, required:boolean = false) {
    this.key = key;
    this.value = value;
    this.required = required;
  }

  static fromJson(json: string): Preference {
    const value= JSON.parse(json);
    return new Preference(
      value.key,
      value.value,
      value.required ?? false);
  }
};
