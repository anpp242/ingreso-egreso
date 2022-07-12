export class Usuario{
    static fromFire(  {uid, nombre, email}  ){
        return new Usuario( uid, nombre, email );
    }

    constructor(
        public uid: string,
        public nombre: string,
        public email: string,
    ){}
}