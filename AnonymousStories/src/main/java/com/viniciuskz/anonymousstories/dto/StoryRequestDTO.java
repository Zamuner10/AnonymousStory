package com.viniciuskz.anonymousstories.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record StoryRequestDTO(
        @NotBlank(message = "Título obrigatório")
        @Size(min = 5,  max = 80, message = "O título deve ter entre 5 e 80 caracteres")
        String title,

        @NotBlank(message = "Conteúdo obrigatório")
        @Size(min = 30, max = 700, message = "O conteúdo deve ter entre 30 e 700 caracteres")
        String content,

        // CORRIGIDO: estava "isAnonymous" — isso muda o nome da chave que a
        // API espera no JSON (records usam o nome do componente como nome
        // do campo JSON). O frontend manda a chave "anonymous" (sem o
        // "is"), então o valor nunca chegava aqui, e a escolha da pessoa
        // era sempre ignorada, caindo no padrão (Anônimo).
        Boolean anonymous
) {
        public StoryRequestDTO{
                if(anonymous==null){
                        anonymous=true;
                }
        }
}