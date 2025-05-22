import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-registro-eventos',
  templateUrl: './registro-eventos.component.html',
  styleUrls: ['./registro-eventos.component.scss']
})
export class RegistroEventosComponent implements OnInit {
  eventoForm!: FormGroup;
   today = new Date();
  tiposEvento = ['Conferencia', 'Taller', 'Seminario', 'Concurso'];
  programasEducativos = [
    'Ingeniería en Ciencias de la Computación',
    'Licenciatura en Ciencias de la Computación',
    'Ingeniería en Tecnologías de la Información'
  ];
  responsables: any[] = []; // Se llenará desde el backend
  horaInvalida: boolean = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.eventoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],
      tipo: ['', Validators.required],
      fecha: ['', Validators.required],
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required],
      lugar: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]],
      publicoObjetivo: this.fb.group({
        estudiantes: [false],
        profesores: [false],
        general: [false]
      }),
      programaEducativo: [''],
      responsable: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.maxLength(300)]],
      cupoMaximo: ['', [Validators.required, Validators.pattern('^[1-9][0-9]{0,2}$')]]
    });

  
    this.cargarResponsables(); 
    this.validarHoras();                           // Método que luego conectaremos con backend
  }


  cargarResponsables() {
    // Simulado: luego conectamos con el backend
    this.responsables = [
      { id: 1, nombre: 'Prof. Ana' },
      { id: 2, nombre: 'Admin Juan' }
    ];
  }
  

  mostrarProgramaEducativo(): boolean {
    return this.eventoForm.get('publicoObjetivo')?.value;
  }

   validarHoras() {
    this.eventoForm.get('horaFin')?.valueChanges.subscribe(() => {
      const inicio = this.eventoForm.get('horaInicio')?.value;
      const fin = this.eventoForm.get('horaFin')?.value;

      if (inicio && fin && new Date(fin) <= new Date(inicio)) {
        this.horaInvalida = true;
        this.eventoForm.get('horaFin')?.setErrors({ horaInvalida: true });
      } else {
        this.horaInvalida = false;
        this.eventoForm.get('horaFin')?.setErrors(null);
      }
    });
  }
  limitarDigitos(event: any): void {
  const input = event.target as HTMLInputElement;
  if (input.value.length > 3) {
    input.value = input.value.slice(0, 3);
    this.eventoForm.get('cupoMaximo')?.setValue(input.value);
  }
}



enviarFormulario() {
  if (this.eventoForm.invalid) {
    this.eventoForm.markAllAsTouched(); // muestra errores si hay campos vacíos
    return;
  }

  // Lógica de envío si es válido
  console.log(this.eventoForm.value);
}


}