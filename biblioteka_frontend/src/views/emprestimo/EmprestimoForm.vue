<script lang="ts" setup>
import { reactive, watch } from "vue";
import { Form, Field } from 'vee-validate';
import { useNotificationStore } from '@/stores/Notification';
import { Emprestimo, Livro } from '@/types';
import EmprestimoService from "@/api/EmprestimoService";
import LivroService from "@/api/LivroService";
const emit = defineEmits(['submitted', 'canceled'])

const props = defineProps<{
    dialogVisible: boolean,
    emprestimoId: number,
    leitorId?: number,
    livroId?: number
}>();

const state = reactive({
    emprestimo: {} as Emprestimo,
    livro: null as unknown as Livro,
    dialog: false as boolean,
    listaLivros: [] as Livro[],
    senha: "" as string
})

const constant = {
    notificationStore: useNotificationStore()
}

async function loadEmprestimo() {
    if (props.emprestimoId == null) state.emprestimo = {} as Emprestimo;
    else {
        try {
            const emprestimo = await EmprestimoService.getById(props.emprestimoId);
            state.emprestimo = emprestimo;
        } catch (error) {
            console.error("Erro ao carregar detalhes do emprestimo: ", error);
        }
    }
}

const leitor = {
    id: props.leitorId
}


const livro = {
    id: props.livroId
}

async function onSubmit(values: any, actions: any) {
    try {
        if (props.leitorId != null)  await EmprestimoService.create(props.leitorId, state.livro.id, state.senha);
        if (props.livroId != null) await EmprestimoService.create(state.leitor.id, props.livroId, state.senha);
        emit("submitted")
        actions.resetForm();
    }
    catch (err) {
        console.error("Erro ao cadastrar empréstimo:", err);
        constant.notificationStore.notificar({ mensagem: "Erro ao ao cadastrar empréstimo!", tipoMensagem: "error", visibilidade: true })
    }
}

watch(
    () => props.dialogVisible,
    (novoDialogVisible) => {
        state.dialog = novoDialogVisible;
        if (novoDialogVisible) loadEmprestimo();
    },
);

function cancel() {
    emit("canceled");
}


async function buscarLivros(livrosSearch: string) {
    if (livrosSearch != '') {
        try {
            const encodeUriSearch = encodeURIComponent(livrosSearch);
            const livrosList = await LivroService.findAllLivrosWithISBNFilter(encodeUriSearch);
            state.listaLivros = livrosList;
        } catch (error) {
            console.error("Erro ao buscar a lista de livros:", error);
        }
    } else if (state.listaLivros.length > 0) {
        state.listaLivros = [];
    }
}


</script>

<template>
    <v-dialog v-model="state.dialog" persistent width="60%">
        <v-card>
            <v-card-title class="mx-auto my-4">
                <span class="text-h5">Cadastrar Empréstimo</span>
            </v-card-title>
            <v-card-text>
                <Form @submit="onSubmit" @reset="cancel()">
                    <v-container>
                        <v-row >
                            <v-col cols="5">
                                <Field name="livro" v-model="state.livro" v-slot="{ field, errors }">
                                    <v-autocomplete class="mt-6" v-model="state.livro"
                                        v-bind="{field}" :error-messages="errors" :items="state.listaLivros"
                                        item-title="isbn" item-value="id" return-object
                                        label="Filtrar por ISBN do Livro" variant="outlined"
                                        @update:search="buscarLivros"
                                        no-data-text="Digite algum ISBN para buscar os livros"></v-autocomplete>
                                </Field>
                            </v-col>
                            <v-col cols="3" class="mt-6">
                                <Field name="senha" v-model.trim="state.senha" v-slot="{ field, errors }">
                                    <v-text-field type="password" v-bind="field" label="Senha" variant="outlined"
                                        v-model="state.senha" :error-messages="errors">
                                    </v-text-field>
                                </Field>
                            </v-col>
                        </v-row>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn class="mb-6" color="grey-darken-4" variant="outlined" type="reset">
                                Cancelar
                            </v-btn>
                            <v-btn class="mb-6" color="primary" variant="flat" type="submit" data-cy="btnSalvar">
                                Salvar
                            </v-btn>
                        </v-card-actions>
                    </v-container>
                </Form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
