import { Injectable } from '@angular/core';
import { ValidatorService } from './tools/validator.service';
import { ErrorsService } from './tools/errors.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FacadeService } from './facade.service';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AlumnosService {

  constructor(
    private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
    private facadeService: FacadeService
  ) { }

  public esquemaAlumno(){
    return {
      'rol':'',
      'matricula': '',
      'first_name': '',
      'last_name': '',
      'email': '',
      'password': '',
      'confirmar_password': '',
      'fecha_nacimiento': '',
      'curp': '',
      'rfc': '',
      'edad': '',
      'telefono': '',
      'ocupacion': ''
    }
  }

  //Validación para el formulario
  public validarAlumno(data: any, editar: boolean){

    console.log("Validando alumnos... ", data);

    let error: any = [];

		//MATRICULA
    if(!this.validatorService.required(data["matricula"])){
      error["matricula"] = this.errorService.required;
    }

		//FIRST_NAME
    if(!this.validatorService.required(data["first_name"])){
      error["first_name"] = this.errorService.required;
    }

		//LAST_NAME
    if(!this.validatorService.required(data["last_name"])){
      error["last_name"] = this.errorService.required;
    }

		//EMAIL
    if(!this.validatorService.required(data["email"])){
      error["email"] = this.errorService.required;
    }else if(!this.validatorService.max(data["email"], 40)){
      error["email"] = this.errorService.max(40);
    }else if (!this.validatorService.email(data['email'])) {
      error['email'] = this.errorService.email;
    }

		//CONTRASEÑA
    if(!editar){
      if(!this.validatorService.required(data["password"])){
        error["password"] = this.errorService.required;
      }

      if(!this.validatorService.required(data["confirmar_password"])){
        error["confirmar_password"] = this.errorService.required;
      }
    }

    //FECHA DE NACIMIENTO
		if (!this.validatorService.required(data["fecha_nacimiento"])) {
			error["fecha_nacimiento"] = this.errorService.required;
		} else if (!this.validatorService.date(data["fecha_nacimiento"])) {
		  error["fecha_nacimiento"] = "Formato de fecha inválido";
		}

		//CURP
		if (!this.validatorService.required(data["curp"])) {
		  error["curp"] = this.errorService.required;
		} else if (!this.validatorService.min(data["curp"], 18)) {
		  error["curp"] = this.errorService.min(18);
		  alert("La CURP debe tener exactamente 18 caracteres.");
		} else if (!this.validatorService.max(data["curp"], 18)) {
		  error["curp"] = this.errorService.max(18);
		  alert("La CURP debe tener exactamente 18 caracteres.");
		} else if (!/^[A-Z0-9]{18}$/.test(data["curp"])) {
		  error["curp"] = "El CURP debe contener solo letras mayúsculas y números.";
		}

    //RFC
    if(!this.validatorService.required(data["rfc"])){
      error["rfc"] = this.errorService.required;
    }else if(!this.validatorService.min(data["rfc"], 12)){
      error["rfc"] = this.errorService.min(12);
      alert("La longitud de caracteres deL RFC es menor, deben ser 12");
    }else if(!this.validatorService.max(data["rfc"], 13)){
      error["rfc"] = this.errorService.max(13);
      alert("La longitud de caracteres deL RFC es mayor, deben ser 13");
    }

		//EDAD
    if(!this.validatorService.required(data["edad"])){
      error["edad"] = this.errorService.required;
    }else if(!this.validatorService.numeric(data["edad"])){
      alert("El formato es solo números");
    }else if(data["edad"]<18){
      error["edad"] = "La edad debe ser mayor o igual a 18";
    }


		//TELEFONO
    if(!this.validatorService.required(data["telefono"])){
      error["telefono"] = this.errorService.required;
    }

		//OCUPACION
    if(!this.validatorService.required(data["ocupacion"])){
      error["ocupacion"] = this.errorService.required;
    }

    //Return arreglo
    return error;

  }//END FUNCTION

   //Aquí van los servicios HTTP
    //Servicio para registrar un nuevo usuario
    public registrarAlumno (data: any): Observable <any>{
      return this.http.post<any>(`${environment.url_api}/alumnos/`,data, httpOptions);
    }

    public obtenerListaAlumnos (): Observable <any>{
      var token = this.facadeService.getSessionToken();
      var headers = new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+token});
      return this.http.get<any>(`${environment.url_api}/lista-alumnos/`, {headers:headers});
    }

    //Obtener un solo usuario dependiendo su ID
      public getAlumnoByID(idUser: Number){
        return this.http.get<any>(`${environment.url_api}/alumnos/?id=${idUser}`,httpOptions);
      }

      //Servicio para actualizar un usuario
      public editarAlumno (data: any): Observable <any>{
        var token = this.facadeService.getSessionToken();
        var headers = new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+token});
        return this.http.put<any>(`${environment.url_api}/alumnos-edit/`, data, {headers:headers});
      }

      //Eliminar Admin
      public eliminarAlumno (idUser: number): Observable <any>{
        var token = this.facadeService.getSessionToken();
        var headers = new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+token});
        return this.http.delete<any>(`${environment.url_api}/alumnos-edit/?id=${idUser}`,{headers:headers});
      }

}//END OF THE CLASS AlumnosServices
