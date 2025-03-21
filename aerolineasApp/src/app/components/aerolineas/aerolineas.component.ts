import { Component } from '@angular/core';
import { AerolineasService } from '../../services/aerolineas.service';
import { Aerolinea } from '../../models/aerolinea.models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-aerolineas',
  standalone: false,
  templateUrl: './aerolineas.component.html',
  styleUrl: './aerolineas.component.css'
})


export class AerolineasComponent {

  aerolineas: Aerolinea[] = [];
  aerolineasForm: FormGroup;
  showForm: boolean = false;
  textoModal: string = "Nueva Aerolinea";
  isEditMode: boolean = false;
  selectedAerolinea: Aerolinea | null = null;


  constructor(private aerolineaService: AerolineasService
    , private formBuilder: FormBuilder
  ) {
    this.aerolineasForm = formBuilder.group({
      id: [null],
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      iata: ['', [Validators.required, Validators.maxLength(50)]],
      estatus: [1, [Validators.required]],
      pais: ['', [Validators.required, Validators.maxLength(50)]],
      fechaFundacion: ['', [Validators.required]]

    })

  }

  ngOnInit(): void {
    this.loadAerolineas();
  }

  loadAerolineas(): void {
    this.aerolineaService.getAerolineas().subscribe({
      next: data => {
        this.aerolineas = data;
        console.log(data);
      }
    })
  }


  toggleForm(): void {
    this.showForm = !this.showForm;
    this.textoModal = "Nueva aerolinea";
    this.isEditMode = false;
    this.selectedAerolinea = null;
    this.aerolineasForm.reset();

  }


  onSubmit(): void {
    if (this.aerolineasForm.invalid) {
      return;
    }
    const aerolineaData: Aerolinea = this.aerolineasForm.value;
    if (this.isEditMode) {
      this.aerolineaService.updateAerolinea(aerolineaData).subscribe({
        next: (updateAerolinea) => {
          const index = this.aerolineas.findIndex(a => a.id === aerolineaData.id);
          if (index !== -1) {
            this.aerolineas[index] = updateAerolinea;
          }
          Swal.fire({
            title: "Aerolinea" + updateAerolinea.nombre + "actualizada",
            text: "la aerolinea fue actualizada exitosamente",
            icon: "success"
          });
        }, error: (error) => {
          this.mostrarErrores(error);
        }
      });
    } else {
      this.aerolineaService.createAerolinea(aerolineaData).subscribe({
        next: (newAerolinea) => {
          Swal.fire({
            title: "Aerolinea" + newAerolinea.nombre + " creada",
            text: "La aerolinea fue creada exitosamente",
            icon: "success"
          });
          this.aerolineas.push(newAerolinea);



        }, error: (error) => {
          this.mostrarErrores(error);
        }
      })

    }
    this.showForm = false;
    this.aerolineasForm.reset();

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








  editAerolinea(aerolinea: Aerolinea) {
    this.selectedAerolinea = aerolinea;
    this.textoModal = "Editando Aerolinea" + aerolinea.nombre;
    this.isEditMode = true;
    this.showForm = true;

    this.aerolineasForm.patchValue({
      id: aerolinea.id,
      nombre: aerolinea.nombre,
      iata: aerolinea.iata,
      status: aerolinea.estatus,
      pais: aerolinea.pais,
      fechaFundacion: aerolinea.fechaFundacion
    })
  }

  deleteAerolinea(idAerolinea: number) {
    Swal.fire({
      title: "Eliminar aerolinea",
      text: "Esta seguro que deseas eliminar la aerolinea",
      icon: "question",
      showConfirmButton:true,
      showCancelButton:true
    }).then(resp=>{
      if(resp.isConfirmed){
        this.aerolineaService.deleteAerolinea(idAerolinea).subscribe({
          next:(deleteAerolinea)=>{
            this.aerolineas=this.aerolineas.filter(a=>a.id!==idAerolinea);
            Swal.fire({
              title: "Aerolinea Eliminada",
              text:"La aerolinea fue eliminada exitosamnete",
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