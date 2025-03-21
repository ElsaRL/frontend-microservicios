import { Component } from '@angular/core';
import { AvionesService } from '../../services/aviones.service';
import { Avion } from '../../models/avion.models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-aviones',
  standalone: false,
  templateUrl: './aviones.component.html',
  styleUrl: './aviones.component.css'
})
export class AvionesComponent {

  aviones: Avion[] = [];

  avionesForm: FormGroup;
  showForm: boolean = false;
  textoModal: string = "Nuevo avion";
  isEditMode: boolean = false;
  selectedAvion: Avion | null = null;


  constructor(private avionService: AvionesService
    , private formBuilder: FormBuilder
  ) {
    this.avionesForm = formBuilder.group({
      id: [null],
      numRegistro: [1, [Validators.required]],
      tipo: ['', [Validators.required, Validators.maxLength(50)]],
      codigoModelo: ['', [Validators.required, Validators.maxLength(50)]],
      capacidad: [1, [Validators.required]],
      fechaPrimerVuelo: ['', [Validators.required]],
      estatus: [1, [Validators.required]],
      //aerolinea: ['', [Validators.required]]

    })

  }

  ngOnInit(): void {
    this.loadAviones();
  }

  loadAviones(): void {
    this.avionService.getAviones().subscribe({
      next: data => {
        this.aviones = data;
        console.log(data);
      }
    })
  }


  toggleForm(): void {
    this.showForm = !this.showForm;
    this.textoModal = "Nuevo avion";
    this.isEditMode = false;
    this.selectedAvion = null;
    this.avionesForm.reset();

  }


  onSubmit(): void {
    if (this.avionesForm.invalid) {
      return;
    }
    const avionData: Avion = this.avionesForm.value;
    if (this.isEditMode) {
      this.avionService.updateAvion(avionData).subscribe({
        next: (updateAvion) => {
          const index = this.aviones.findIndex(a => a.id === avionData.id);
          if (index !== -1) {
            this.aviones[index] = updateAvion;
          }
          Swal.fire({
            title: "Avion" + updateAvion.codigoModelo + "actualizada",
            text: "el avion fue actualizada exitosamente",
            icon: "success"
          });
        }, error: (error) => {
          this.mostrarErrores(error);
        }
      });
    } else {
      this.avionService.createAvion(avionData).subscribe({
        next: (newAvion) => {
          Swal.fire({
            title: "Avion" + newAvion.codigoModelo + " creada",
            text: "El avion fue creada exitosamente",
            icon: "success"
          });
          this.aviones.push(newAvion);
        }, error: (error) => {
          this.mostrarErrores(error);
        }
      })

    }
    this.showForm = false;
    this.avionesForm.reset();

  }

  mostrarErrores(errorResponse: any): void {
    if (errorResponse && errorResponse.console.error) {
      let errores = errorResponse.error;
      let mensajeErrores = "";
      for (let campo in errores) {
        if (errores.hasOwnProperty(campo)) {
          mensajeErrores += errores[campo];
        }
      }
      Swal.fire({
        title: "Errores encontrados",
        text: mensajeErrores.trim(),
        icon: "error"
      });
    }
  }


  editAerolinea(avion: Avion) {
    this.selectedAvion = avion;
    this.textoModal = "Editando Avion" + avion.codigoModelo;
    this.isEditMode = true;
    this.showForm = true;

    this.avionesForm.patchValue({
      id: avion.id,
      numRegistro: avion.numRegistro,
      tipo: avion.tipo,
      codigoModelo: avion.codigoModelo,
      capacidad: avion.capacidad,
      fechaPrimerVuelo: avion.fechaPrimerVuelo,
      status: avion.estatus
      //aerolinea: avion.aerolinea,
    })
  }

  deleteAvion(idAvion: number) {
    Swal.fire({
      title: "Eliminar avion",
      text: "Esta seguro que deseas eliminar el avion",
      icon: "question",
      showConfirmButton:true,
      showCancelButton:true
    }).then(resp=>{
      if(resp.isConfirmed){
        this.avionService.deleteAvion(idAvion).subscribe({
          next:(deleteAerolinea)=>{
            this.aviones=this.aviones.filter(a=>a.id!==idAvion);
            Swal.fire({
              title: "Avion Eliminada",
              text:"El avion fue eliminada exitosamnete",
              icon: "success"
            });

          },
          error:(error)=>{
            this.mostrarErrores(error);
          }
        })
      }
    })

  }

}
