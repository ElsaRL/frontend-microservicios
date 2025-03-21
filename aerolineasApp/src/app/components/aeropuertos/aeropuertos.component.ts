import { Component } from '@angular/core';
import { AeropuertosService } from '../../services/aeropuertos.service';
import { Aeropuerto } from '../../models/aeropuerto.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-aeropuertos',
  standalone: false,
  templateUrl: './aeropuertos.component.html',
  styleUrl: './aeropuertos.component.css'
})
export class AeropuertosComponent {
  aeropuertos: Aeropuerto[] = [];
  aeropuertosForm: FormGroup;
  showForm: boolean = false;
  textoModal: string = "Nueva Aerolinea";
  isEditMode: boolean = false;
  selectedAerolinea: Aeropuerto | null = null;


  constructor(private aeropuertoService: AeropuertosService
    , private formBuilder: FormBuilder
  ) {
    this.aeropuertosForm = formBuilder.group({
      id: [null],
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      codigo: ['', [Validators.required, Validators.maxLength(50)]],
      latitud: ['', [Validators.required, Validators.maxLength(50)]],
      longitud: ['', [Validators.required, Validators.maxLength(50)]],
      pais: ['', [Validators.required, Validators.maxLength(50)]],
      estatus: [1, [Validators.required]],
    })

  }

  ngOnInit(): void {
    this.loadAeropuertos();
  }

  loadAeropuertos(): void {
    this.aeropuertoService.getAeropuertos().subscribe({
      next: data => {
        this.aeropuertos = data;
        console.log(data);
      }
    })
  }


  toggleForm(): void {
    this.showForm = !this.showForm;
    this.textoModal = "Nueva aeropuerto";
    this.isEditMode = false;
    this.selectedAerolinea = null;
    this.aeropuertosForm.reset();

  }


  onSubmit(): void {
    if (this.aeropuertosForm.invalid) {
      return;
    }
    const aeropuertoData: Aeropuerto = this.aeropuertosForm.value;
    if (this.isEditMode) {
      this.aeropuertoService.updateAeropuerto(aeropuertoData).subscribe({
        next: (updateAeropuerto) => {
          const index = this.aeropuertos.findIndex(a => a.id === aeropuertoData.id);
          if (index !== -1) {
            this.aeropuertos[index] = updateAeropuerto;
          }
          Swal.fire({
            title: "Aeropuerto" + updateAeropuerto.nombre + "actualizada",
            text: "el aeropuerto fue actualizada exitosamente",
            icon: "success"
          });
        }, error: (error) => {
          this.mostrarErrores(error);
        }
      });
    } else {
      this.aeropuertoService.createAeropuerto(aeropuertoData).subscribe({
        next: (newAeropuerto) => {
          Swal.fire({
            title: "Aeropuertolinea" + newAeropuerto.nombre + " creada",
            text: "El aeropuerto fue creada exitosamente",
            icon: "success"
          });
          this.aeropuertos.push(newAeropuerto);



        }, error: (error) => {
          this.mostrarErrores(error);
        }
      })

    }
    this.showForm = false;
    this.aeropuertosForm.reset();

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

  editAeropuerto(aeropuerto: Aeropuerto) {
    this.selectedAerolinea = aeropuerto;
    this.textoModal = "Editando Aeropuerto" + aeropuerto.nombre;
    this.isEditMode = true;
    this.showForm = true;

    this.aeropuertosForm.patchValue({
      id: aeropuerto.id,
      nombre: aeropuerto.nombre,
      codigo: aeropuerto.codigo,
      latitud: aeropuerto.latitud,
      longitud: aeropuerto.longitud,
      pais: aeropuerto.pais,
      status: aeropuerto.estatus
    })
  }

  deleteAeropuerto(idAeropuerto: number) {
    Swal.fire({
      title: "Eliminar aeropuerto",
      text: "Esta seguro que deseas eliminar el aeropuerto",
      icon: "question",
      showConfirmButton:true,
      showCancelButton:true
    }).then(resp=>{
      if(resp.isConfirmed){
        this.aeropuertoService.deleteAeropuerto(idAeropuerto).subscribe({
          next:(deleteAeropuerto)=>{
            this.aeropuertos=this.aeropuertos.filter(a=>a.id!==idAeropuerto);
            Swal.fire({
              title: "Aeropuerto Eliminada",
              text:"La aeropuerto fue eliminada exitosamnete",
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
