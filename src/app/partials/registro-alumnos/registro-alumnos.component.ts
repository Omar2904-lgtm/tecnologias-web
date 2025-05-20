import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Location } from '@angular/common';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { Router } from '@angular/router';
declare var $:any;

@Component({
  selector: 'app-registro-alumnos',
  templateUrl: './registro-alumnos.component.html',
  styleUrls: ['./registro-alumnos.component.scss']
})
export class RegistroAlumnosComponent implements OnInit{
  @Input() rol: string = "";
  @Input() datos_user: any = {};

  //Para contraseñas
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  public alumno:any = {};
  public errors:any = {};
  public editar:boolean = false;
  public token: string = "";
  activatedRoute: any;
  idUser: any;
  admin: any;
  administradoresService: any;
  facadeService: any;


  constructor(
    private location: Location,
    private alumnoService: AlumnosService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.alumno = this.alumnoService.esquemaAlumno();
  this.alumno.rol = this.rol;

  if (this.datos_user && Object.keys(this.datos_user).length > 0) {
    console.log("Datos del alumno recibidos:", this.datos_user);
    this.editar = true;
    this.alumno = {
      ...this.alumno,
      ...this.datos_user,
      ...this.datos_user.user || {},
      fecha_nacimiento: this.datos_user.fecha_nacimiento
        ? this.datos_user.fecha_nacimiento.split("T")[0]
        : ''
    };
  }

  console.log("Los datos del alumno son: ", this.alumno);
}


  //Funciones para password
  showPassword()
  {
    if(this.inputType_1 == 'password'){
      this.inputType_1 = 'text';
      this.hide_1 = true;
    }
    else{
      this.inputType_1 = 'password';
      this.hide_1 = false;
    }
  }

  showPwdConfirmar()
  {
    if(this.inputType_2 == 'password'){
      this.inputType_2 = 'text';
      this.hide_2 = true;
    }
    else{
      this.inputType_2 = 'password';
      this.hide_2 = false;
    }
  }

  public regresar(){
    this.location.back();
  }

  public registrar(){

    //Validación del formulario
    this.errors = [];

    this.errors = this.alumnoService.validarAlumno(this.alumno, this.editar);
    if(!$.isEmptyObject(this.errors)){
      return false;
    }
    //Validar la contraseña
    if(this.alumno.password == this.alumno.confirmar_password){
      //Aquí se va a ejecutar la lógica de programación para registrar un usuario
      this.alumnoService.registrarAlumno(this.alumno).subscribe(
        (response)=>{
          //Aquí va la ejecución del servicio si todo es correcto
          alert("Usuario registrado correctamente");
          console.log("Usuario registrado: ", response);
          if(this.token != ""){
            this.router.navigate(["home"]);
          }else{
            this.router.navigate(["/"]);
          }
        }, (error)=>{
          //Aquí se ejecuta el error
          alert("No se pudo registrar usuario");
        }
      );


    }else{
      alert("Las contraseñas no coinciden");
      this.alumno.password="";
      this.alumno.confirmar_password="";
    }

  }

  public actualizar(){
    //Validación
    this.errors = [];

    this.errors = this.alumnoService.validarAlumno(this.alumno, this.editar);
    if(!$.isEmptyObject(this.errors)){
      return false;
    }
    console.log("Pasó la validación");

    this.alumnoService.editarAlumno(this.alumno).subscribe(
      (response)=>{
        alert("Alumno editado correctamente");
        console.log("Alumno editado: ", response);
        //Si se editó, entonces mandar al home
        this.router.navigate(["home"]);
      }, (error)=>{
        alert("No se pudo editar el Alumno");
      }
    );

  }

  //Función para detectar el cambio de fecha
  public changeFecha(event :any){
    console.log(event);
    console.log(event.value.toISOString());

    this.alumno.fecha_nacimiento = event.value.toISOString().split("T")[0];
    console.log("Fecha: ", this.alumno.fecha_nacimiento);
  }

  public soloLetras(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    // Permitir solo letras (mayúsculas y minúsculas) y espacio
    if (
      !(charCode >= 65 && charCode <= 90) &&  // Letras mayúsculas
      !(charCode >= 97 && charCode <= 122) && // Letras minúsculas
      charCode !== 32                         // Espacio
    ) {
      event.preventDefault();
    }
  }
}
