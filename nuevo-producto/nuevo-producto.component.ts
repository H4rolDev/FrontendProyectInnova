import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Producto, ProductoBody } from 'src/app/shared/models/producto';
import { ProductoService } from 'src/app/shared/services/producto.service';

@Component({
  selector: 'app-nuevo-producto',
  templateUrl: './nuevo-producto.component.html',
  styleUrls: ['./nuevo-producto.component.css']
})

export class NuevoProductoComponent implements OnInit {
  cargaDatos: 'none' | 'loading' | 'done' | 'error' = "none";
  createProductState: 'none' | 'loading' | 'done' | 'error' = "none";
  products: Producto[] = [];
  showFormProduct: 'none' | 'edit' | 'add' = 'none';
  formProducto: FormGroup;
  constructor(private router: Router, private productoService: ProductoService,
    private fb: FormBuilder) {
      // Validaciones
      this.formProducto = this.fb.group({
        Nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      });
     }

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
    this.listAll();
  }
  
  listAll() {
    this.cargaDatos = 'loading';
    this.productoService.list().subscribe({
      next: (data) => {
        this.cargaDatos = 'done';
        this.products = data;
      },
      error: (_) => {
        this.cargaDatos = 'error';
      }
    });
  }

  addProduct() {
    this.showFormProduct = "add";
    this.createProductState = 'none';
  }

  removeProduct(producto: Producto) {
    producto.remove = true;
  }

  confirmDelete(productoId: number) {
    this.productoService.remove(productoId).subscribe({
      next: (res) => {
        // this.listAll();
        this.products = this.products.filter(b => b.id != productoId);
      },
      error: (err) => {}
    });
  }
  cancelDelete(producto: Producto) {
    producto.remove = false;
  }

  createProduct(){
    console.log(this.formProducto);
    this.createProductState = 'loading';
    this.productoService.create(this.formProducto.value as ProductoBody).subscribe({
      next: (data) => {
        this.createProductState = 'done';
        // this.listAll();
        this.products.push(data);
      },
      error: (err) => {
        this.createProductState = 'error';
      }
    });
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
  /* modal para confirmacion de descarte y regresar*/
  openModal(): void {
    const modal = document.getElementById('categorias');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  }

  // Método para cerrar el modal
  closeModal(): void {
    const modal = document.getElementById('categorias');
    if (modal) {
      modal.classList.remove('flex');
      modal.classList.add('hidden');
    }
  }

  // Confirmar acción y redirigir
  confirmDiscard(): void {
    this.closeModal();  // Cierra el modal

    // Lógica para redirigir a la ruta especificada
    this.router.navigate(['/administracion/gestion/producto/lista']);
  }
}
