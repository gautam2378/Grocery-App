import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddProducts } from 'src/app/Models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  productForm!: FormGroup;
  product: AddProducts = {
    productName: '',
    description: '',
    category: '',
    availableQuantity: 0,
    image: '',
    price: 0,
    discount: 0,
    specification: ''
  };

  constructor(
    private http: HttpClient,
    private productService: ProductService,
    private appComponent: AppComponent,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder
  ) {
    this.appComponent.showNavBar = false;
  }

  ngOnInit() {
    this.productForm = this.formBuilder.group({
      productName: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      availableQuantity: [0, [Validators.required, Validators.min(0)]],
      image:'',
      price: [0, [Validators.required, Validators.min(0)]],
      discount: [0, [Validators.min(0)]],
      specification: ['', Validators.required],
    });
  }
  
  isInvalid(controlName: string): boolean {
    const control = this.productForm.get(controlName);
    return control ? control.invalid && control.touched : false;
  }
  onFileSelected(event: any) {
    const imageFile: File = event.target.files[0];
  
    
    if (imageFile.type !== 'image/jpeg') {
      
      console.error('Only JPG files are supported!');
      this.openSnackBar('Only JPG files are supported!', 'Error!');
    
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
            this.productForm.patchValue({ image: response.imageUrl });
            console.log(this.product)
            this.openSnackBar('Image saved successfully!', 'Success!');
            console.log('Image saved successfully:', response.imageUrl);
          } else {
            console.error('Invalid response:', response);
            this.openSnackBar('Invalid response', 'Error!!!');
          }
        },
        (error: any) => {
          console.error('Error saving image:', error);
          this.openSnackBar('Error saving image', 'Error!!!');
        }
      );
  }  
  
  addProduct() {
    if (this.productForm.valid) {
      
      this.product = { ...this.productForm.value };
       
      this.productService.addProduct(this.product).subscribe(
        response => {
          
          this.openSnackBar('Product added successfully', 'Success!');
          console.log('Product added:', response);
          console.log(this.productForm);
          this.productForm.reset(); 
        },
        error => {
          
          this.openSnackBar('Error adding product', 'Error!');
          console.log('Error adding product:', error);
        }
      );
    } else {
      
      this.openSnackBar('Invalid form input', 'Error!');
    }
  }
  
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 6000 
    });
  }
}
