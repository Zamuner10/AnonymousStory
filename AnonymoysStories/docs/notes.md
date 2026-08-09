### ResponseEntity<T> ###

→ Representa a resposta HTTP enviada ao cliente.
→ O tipo T é o objeto que será enviado no body da resposta.

Exemplos:

ResponseEntity<User>
→ devolve um usuário.

ResponseEntity<List<User>>
→ devolve uma lista de usuários.

ResponseEntity<String>
→ devolve uma mensagem de texto.

ResponseEntity<Void>
→ não devolve nada.


-------------------------------------------------------------------------------------------------
## Optional<User> user = userRepository.findByEmail(email); ###

Optional

→ Representa um objeto que pode existir ou não.

isPresent()
→ existe valor.

isEmpty()
→ não existe valor.

get()
→ pega o objeto que está dentro do Optional.




-------------------------------------------------------------------------------------------------
### throw new IllegalArgumentException(...) ###

→ Interrompe o fluxo do método.

→ Lança uma exceção.

→ O Spring envia essa exceção para o GlobalExceptionHandler.




-------------------------------------------------------------------------------------------------

@RestController
→ Recebe requisições HTTP.

@Service
→ Contém as regras de negócio.

@Repository
→ Acessa o banco de dados.

@Entity
→ Representa uma tabela.

@ControllerAdvice
→ Trata exceções da aplicação inteira.


-------------------------------------------------------------------------------------------------

### Entendendo o Código ###

    PasswordEncoder     passwordEncoder         =           new         BCryptPasswordEncoder();
  tipo de variavel      nome da variavel       receba       crie            objeto


Crie um novo objeto da classe BCryptPasswordEncoder e guarde esse objeto dentro da variável passwordEncoder, que é do tipo PasswordEncoder.
Tipo da variável, nome da variável, que vai receber um objeto novo criado a partir de uma classe.