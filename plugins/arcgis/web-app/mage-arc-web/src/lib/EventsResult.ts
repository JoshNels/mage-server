export class EventResult {
    name: string;
    forms: FormResult[];
}

export class FormResult {
    name: string;
    fields: FieldResult[];
}

export class FieldResult {
    title: string;
}