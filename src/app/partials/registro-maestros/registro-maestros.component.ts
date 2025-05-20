import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MaestrosService } from 'src/app/services/maestros.service';
import { Router } from '@angular/router';
declare var $:any;


@Component({
  selector: 'app-registro-maestros',
  templateUrl: './registro-maestros.component.html',
  styleUrls: ['./registro-maestros.component.scss']
})
export class RegistroMaestrosComponent implements OnInit {

@Input() rol: string = "";
@Input() datos_user: any = {};

  //Para contraseñas
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  public maestro:any = {};
  public errors:any = {};
  public editar:boolean = false;
  public token: string = "";

  //Para el select
  public areas: any[] = [
    {value: '1', viewValue: 'Desarrollo Web'},
    {value: '2', viewValue: 'Programacion'},
    {value: '3', viewValue: 'Bases de datos'},
    {value: '4', viewValue: 'Redes'},
    {value: '5', viewValue: 'Matematicas'},
  ];

  public materias:any[] = [
    {value: '1', nombre: 'Aplicaciones Web'},
    {value: '2', nombre: 'Programacion 1'},
    {value: '3', nombre: 'Bases de datos'},
    {value: '4', nombre: 'Tecnologias Web'},
    {value: '5', nombre: 'Mineria de datos'},
    {value: '6', nombre: 'Desarrollo movil'},
    {value: '7', nombre: 'Estructuras de datos'},
    {value: '8', nombre: 'Administracion de redes'},
    {value: '9', nombre: 'Ingenieria de Software'},
    {value: '10', nombre: 'Administracion de S.O.'},
  ];

    constructor(
      private location : Location,
      private maestrosService: MaestrosService,
      private router: Router
    ){}

  ngOnInit(): void {
    if (!this.editar) {
    this.maestro = this.maestrosService.esquemaMaestros();
    this.maestro.rol = this.rol;
    this.maestro.materias_json = [];
  }

  console.log("Los datos del maestro son: ", this.maestro);
  }

  ngOnChanges() {
  if (this.datos_user && Object.keys(this.datos_user).length > 0) {
    this.editar = true;
    this.maestro = { ...this.datos_user };

    if (typeof this.maestro.materias_json === 'string') {
      try {
        this.maestro.materias_json = JSON.parse(this.maestro.materias_json);
      } catch (e) {
        console.error("Error al parsear materias_json", e);
        this.maestro.materias_json = [];
      }
    }

    if (!Array.isArray(this.maestro.materias_json)) {
      this.maestro.materias_json = [];
    }
  }
}



  public regresar(){
    this.location.back();
  }

  public registrar(){
         //Validación del formulario
         this.errors = [];

         this.errors = this.maestrosService.validarMaestros(this.maestro, this.editar);
         if(!$.isEmptyObject(this.errors)){
           return false;
         }

         //VALIDAR CONTRASEÑAS
         if(this.maestro.password == this.maestro.confirmar_password){
          //Aquí se va a ejecutar la lógica de programación para registrar un usuario
          this.maestrosService.registrarMaestro(this.maestro).subscribe(
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
          this.maestro.password="";
          this.maestro.confirmar_password="";
        }

  }//END REGISTRAR

  public actualizar(){
    //Validación
    this.errors = [];

    this.errors = this.maestrosService.validarMaestros(this.maestro, this.editar);
    if(!$.isEmptyObject(this.errors)){
      return false;
    }
    console.log("Pasó la validación");

    this.maestrosService.editarMaestro(this.maestro).subscribe(
      (response)=>{
        alert("Maestro editado correctamente");
        console.log("Maestro editado: ", response);
        //Si se editó, entonces mandar al home
        this.router.navigate(["home"]);
      }, (error)=>{
        alert("No se pudo editar el maestro");
      }
    );
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

  //Función para detectar el cambio de fecha
  public changeFecha(event :any){
    console.log(event);
    console.log(event.value.toISOString());

    this.maestro.fecha_nacimiento = event.value.toISOString().split("T")[0];
    console.log("Fecha: ", this.maestro.fecha_nacimiento);
  }

  public checkboxChange(event:any){
    console.log("Evento: ", event);
    if(event.checked){
      this.maestro.materias_json.push(event.source.value)
    }else{
      console.log(event.source.value);
      this.maestro.materias_json.forEach((materia, i) => {
        if(materia == event.source.value){
          this.maestro.materias_json.splice(i,1)
        }
      });
    }
    console.log("Array materias: ", this.maestro);
  }

  public revisarSeleccion(nombre: string){
    if(this.maestro.materias_json){
      var busqueda = this.maestro.materias_json.find((element)=>element==nombre);
      if(busqueda != undefined){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  }

}
