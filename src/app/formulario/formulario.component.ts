import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NotificacaoService } from '../services/notificacao.service'

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css'],
})
export class FormularioComponent {
  formulario: any;
  homeComponent: any;
  cadastros: any;
  id: any;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private notificacaoService: NotificacaoService
  ) {}

  async ngOnInit() {
    this.formulario = this.formBuilder.group({
      nome: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(50),
        ],
      ],
      cep: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      cidade: ['', [Validators.required]],
      bairro: ['', [Validators.required]],
      logradouro: ['', [Validators.required]],
      numero: ['', [Validators.required]],
      complemento: [''],
    });
    this.id = 0;
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      const url = `http://localhost:3000/cadastro/${this.id}`;
      this.http
        .get(url)
        .pipe(
          map((endereco: any) => {
            this.formulario.patchValue({
              nome: endereco.nome,
              cep: endereco.cep,
              cidade: endereco.cidade,
              bairro: endereco.bairro,
              logradouro: endereco.logradouro,
              numero: endereco.numero,
              complemento: endereco.complemento,
            });
          })
        )
        .subscribe();
    }
  }

  buscarEndereco() {
    const cep = this.formulario.get('cep').value;
    if (cep && cep.length === 8) {
      const url = `https://viacep.com.br/ws/${cep}/json/`;
      this.http
        .get(url)
        .pipe(
          map((endereco: any) => {
            this.formulario.patchValue({
              cidade: endereco.localidade,
              bairro: endereco.bairro,
              logradouro: endereco.logradouro,
            });
          })
        )
        .subscribe();
    }
  }

  onSubmit() {
    if (this.formulario.valid) {
      if (this.id) {
        const novoCadastro = this.formulario.value;
        this.http
          .put<any>(`http://localhost:3000/cadastro/${this.id}`, novoCadastro)
          .pipe()
          .subscribe();
        this.router.navigate(['/']);
      } else {
        const novoCadastro = this.formulario.value;
        this.http
          .post<any>('http://localhost:3000/cadastro', novoCadastro)
          .pipe()
          .subscribe();
          this.notificacaoService.openSnackBar('Cadastro realizado com sucesso.', '😍')
        this.router.navigate(['/']);
      }
    } else {
      this.notificacaoService.openSnackBar('Formulario Invalido, verifique os campos preenchidos.', 'OK')
    }
  }
}
