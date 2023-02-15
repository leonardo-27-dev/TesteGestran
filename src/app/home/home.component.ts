import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private http: HttpClient,
    private router: Router,) {}

  cadastros: any[] = [];
  dataSource: any[] = []
  displayedColumns: string[] = []

  async ngOnInit() {
    const url = `http://localhost:3000/cadastro`;
    await this.http.get(url).pipe(
      map((endereco: any) => {
        this.cadastros = endereco
      })
    ).subscribe();
    setTimeout(() => {
      this.dataSource = this.cadastros
    }, 400)
    this.displayedColumns = ['nome', 'cep', 'options'];
  }

  async delete(id: number) {
    const url = `http://localhost:3000/cadastro/${id}`;
    await this.http.delete(url).pipe().subscribe();
    location.reload();
  }

}
