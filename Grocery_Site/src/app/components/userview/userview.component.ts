import { Component,OnInit } from '@angular/core';

import { Products } from 'src/app/Models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-userview',
  templateUrl: './userview.component.html',
  styleUrls: ['./userview.component.css']
})
export class UserviewComponent implements OnInit {
  products: Products[] = [];
  paginatedProducts: Products[][] = [];
  currentPage = 1; 
  pageSize = 6; 
  filteredProducts: Products[] = []; 
  ratings: { [productId: string]: number } = {};
  categories: string[] = []; 
  selectedCategory: string = ''; 
  searchKeyword: string = ''; 

  constructor(private productService: ProductService, private router: Router) {}

  showProductDetails(product: Products) {
    this.router.navigate(['/Product-user-view', product.id]);
  }

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = products; 
        this.fetchRatingsForProducts(products);
        this.extractCategories(products);
        this.paginateProducts();
      },
      error: (error) => {
        console.log('Error:', error); 
      }
    });
  }

  fetchRatingsForProducts(products: Products[]): void {
    for (const product of products) {
      this.productService.getAverageRating(product.id).subscribe({
        next: (rating) => {
          this.ratings[product.id] = rating;
        },
        error: (error) => {
          console.log('Error:', error); 
        }
      });
    }
    this.paginateProducts();
  }

  extractCategories(products: Products[]): void {
    this.categories = [...new Set(products.map((product) => product.category))];
  }

  filterByCategory(): void {
    if (this.selectedCategory) {
      this.filteredProducts = this.products.filter((product) => product.category === this.selectedCategory);
    } else {
      this.filteredProducts = this.products;
    }
    this.paginateProducts();
  }

  filterByKeyword(): void {
    const keyword = this.searchKeyword.toLowerCase();
    this.filteredProducts = this.products.filter(
      (product) =>
        product.productName.toLowerCase().includes(keyword) ||
        product.description.toLowerCase().includes(keyword)
    );
    this.paginateProducts();
  }

  paginateProducts() {
    this.paginatedProducts = [];
    const pageCount = Math.ceil(this.filteredProducts.length / this.pageSize);
    for (let i = 0; i < pageCount; i++) {
      const startIndex = i * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      const page = this.filteredProducts.slice(startIndex, endIndex);
      this.paginatedProducts.push(page);
    }
    this.currentPage = 1;
  }
  get pages(): number[] {
    return Array.from({ length: this.paginatedProducts.length }, (_, index) => index + 1);
  }
  changePage(pageNumber: number) {
    this.currentPage = pageNumber;
  }
}
