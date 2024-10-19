import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nueva-categoria',
  templateUrl: './nueva-categoria.component.html',
  styleUrls: ['./nueva-categoria.component.css']
})
export class NuevaCategoriaComponent implements OnInit {
  constructor(private router: Router) { }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
  /* Propiedades de la barra lateral ******************************** */
  sidebar!: HTMLElement | null;
  menuBtn!: HTMLElement | null;
  closeBtn!: HTMLElement | null;
  overlay!: HTMLElement | null;
  isSidebarActive: boolean = false;

  ngOnInit(): void {
    this.sidebar = document.getElementById("sidebar");
    this.menuBtn = document.getElementById("menu-btn");
    this.closeBtn = document.getElementById("close-btn");
    this.overlay = document.getElementById("overlay");

    this.initializeEventListeners(); // Configurar eventos para la barra lateral
    this.validateForm(); // Llamar a la función de validación del formulario al iniciar
  }

  initializeEventListeners(): void {
    if (this.menuBtn) {
      this.menuBtn.addEventListener("click", this.openSidebar.bind(this));
    }

    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", this.closeSidebar.bind(this));
    }

    if (this.overlay) {
      this.overlay.addEventListener("click", this.closeSidebar.bind(this));
    }

    document.addEventListener("click", (event) => {
      if (this.sidebar && !this.sidebar.contains(event.target as Node) && !this.menuBtn?.contains(event.target as Node)) {
        this.closeSidebar();
      }
    });
  }

  openSidebar(): void {
    if (this.sidebar && this.overlay) {
      this.sidebar.classList.add("show");
      this.overlay.style.display = "block";
      document.body.style.overflow = 'hidden';
      this.isSidebarActive = true;
    }
  }

  closeSidebar(): void {
    if (this.sidebar && this.overlay) {
      this.sidebar.classList.remove("show");
      this.overlay.style.display = "none";
      document.body.style.overflow = '';
      this.isSidebarActive = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    if (this.sidebar && this.overlay) {
      if (window.innerWidth >= 768) {
        this.closeSidebar();
      }
    }
  }

  /* Validación de los campos ******************************** */
  validateForm(): void {
    const form = document.getElementById('product-form') as HTMLFormElement;
    const errorMessage = document.getElementById('error-message') as HTMLElement;
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    const imagePreview = document.getElementById('image-preview') as HTMLElement;

    // Validación del formulario al enviarlo
    form.addEventListener('submit', (event: Event) => {
      errorMessage.textContent = '';
      errorMessage.classList.add('hidden');

      if (!form.checkValidity()) {
        event.preventDefault();
        errorMessage.textContent = 'Por favor, completa todos los campos requeridos.';
        errorMessage.classList.remove('hidden');
      }
    });

    // Manejo del cambio en el input de archivos
    fileInput.addEventListener('change', (event: Event) => {
      const files = (event.target as HTMLInputElement).files;
      console.log('Archivos seleccionados:', files); // Log para verificar archivos seleccionados
      imagePreview.innerHTML = ''; // Limpiar vista previa anterior

      if (files) {
        Array.from(files).forEach(file => {
          const reader = new FileReader();

          reader.onload = (e: ProgressEvent<FileReader>) => {
            console.log('Cargando archivo:', e.target?.result); // Log para verificar el archivo cargado

            const imageContainer = document.createElement('div');
            imageContainer.className = 'relative inline-block m-2';

            const img = document.createElement('img');
            img.src = e.target?.result as string;
            img.className = 'h-32 w-32 object-cover rounded-md border border-gray-300';

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'X';
            deleteButton.className = 'absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs';
            deleteButton.onclick = () => imageContainer.remove(); // Eliminar la imagen al hacer clic

            imageContainer.append(img, deleteButton);
            imagePreview.appendChild(imageContainer); // Añadir el contenedor de imagen a la vista previa
          };

          reader.readAsDataURL(file); // Leer el archivo como URL de datos
        });
      }
    });
  }

  /* modal para confirmacion de descarte */
  isModalOpen = false;
  formData: any = {};
  openModal(): void {
    this.isModalOpen = true;
  }
  closeModal(): void {
    this.isModalOpen = false;
  }
  confirmDiscard(): void {
    console.log('Cambios descartados');
    this.clearForm(); // Limpia el formulario
    this.router.navigate(['/administracion/gestion/productos/categorias']);
    this.closeModal();
  }
  clearForm(): void {
    this.formData = {};
  }
}

