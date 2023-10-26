import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { ProductService } from 'src/app/services/product.service';
import { Products } from 'src/app/Models/product.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adminview',
  templateUrl: './adminview.component.html',
  styleUrls: ['./adminview.component.css']
})
export class AdminviewComponent {
  products: Products[] = [];
  
  searchTerm: string = '';
  selectedCategory: string = '';
  selectedAvailability: string = '';
  showSuccessAlert1: boolean = false;
  categories: string[] = [];
  constructor(private appComponent: AppComponent,
    private router: Router,
    private productService: ProductService) {
    this.appComponent.showNavBar = false;
  }ngOnInit(): void {
    this.getProducts();
  }
  get filteredProducts() {
    return this.products.filter((product) => {
      const searchTermMatch =
        product.productName.toLowerCase().includes(this.searchTerm.toLowerCase());
      const categoryMatch =
        this.selectedCategory === '' || product.category === this.selectedCategory;
      const availabilityMatch =
        this.selectedAvailability === '' ||
        (this.selectedAvailability === 'instock' && product.availableQuantity > 0) ||
        (this.selectedAvailability === 'outofstock' && product.availableQuantity === 0);

      return searchTermMatch && categoryMatch && availabilityMatch;
    });
  }
  extractCategories(products: Products[]): void {
    this.categories = [...new Set(products.map((product) => product.category))];
  }

  getProducts(): void {
    this.productService.getAllProducts().subscribe(
      (products: Products[]) => {
        this.products = products;
        this.extractCategories(products);
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  editProduct(productId: string) {
    this.router.navigate(['Edit-Product', productId])
  }
  
  deleteProduct(productId: string) {
    this.productService.deleteProduct(productId).subscribe(
      response => {
        
        this.products = this.products.filter(product => product.id !== productId);
        console.log("Product deleted")
        this.showSuccessAlert1 = true;
    
        setTimeout(() => {
        this.showSuccessAlert1 = false;
        }, 3000);
      },
      error => {
        
        console.log(productId)
        console.log("Product not deleted",error)
      }
    );
  }
}