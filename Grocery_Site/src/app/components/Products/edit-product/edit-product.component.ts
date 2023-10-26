import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { Products } from 'src/app/Models/product.model';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppComponent } from 'src/app/app.component';


@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  productId!: string;
  product: Products = {
    productName: '',
    description: '',
    category: '',
    availableQuantity: 0,
    image: '',
    price: 0,
    discount: 0,
    specification: '',
    id: ''
  };

  constructor(private route: ActivatedRoute, private productService: ProductService,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private appComponent: AppComponent
    ) {this.appComponent.showNavBar = false;}


  ngOnInit() {
    this.route.params.subscribe(params => {
      this.productId = params['id'];
      this.getProductDetails();
    });
  }

  onFileSelected(event: any) {
    const imageFile: File = event.target.files[0];
  
    
    if (imageFile.type !== 'image/jpeg') {
      
      console.error('Only JPG files are supported.');
      this.openSnackBar('Only JPG files are supported.', 'Error!');
      return;
    }
  
    
    const formData = new FormData();
    formData.append('imageFile', imageFile);
    console.log(formData);
  
  
    this.http.post<any>('https://localhost:6700/api/ImageCopy/upload-image', formData)
      .subscribe(
        (response: any) => {
          if (response && response.imageUrl) {
            
            this.product.image = response.imageUrl;
            console.log(response)
            console.log(this.product)
            this.openSnackBar('Image saved successfully', 'Success!');
            console.log('Image saved successfully:', response.imageUrl);
          } else {
            console.error('Invalid response:', response);
            this.openSnackBar('Invalid response', 'Error!');
          }
        },
        (error: any) => {
          console.error('Error saving image:', error);
          this.openSnackBar('Error saving image', 'Error!');
        }
      );
  }  
  getProductDetails() {
    this.productService.getProductById(this.productId).subscribe(
      (response): void => {
        this.product = response;
      },
      (error) => {
        console.log(error);
        
      }
    );
  }

  
    updateProduct() {
      this.productService.editProduct(this.product).subscribe(
        (response): any => {
          
          console.log(response);
          this.openSnackBar('Product edited','Success!');
        },
        (error): any => {
          
          console.log(error);
        }
      );
    }

openSnackBar(message: string, action: string) {
  this.snackBar.open(message, action, {
    duration: 6000 
  });
}
}

