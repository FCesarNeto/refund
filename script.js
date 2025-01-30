// Seleciona os elementos do formulario.
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

//Seleciona os elementos da lista
const expenseList = document.querySelector("ul")
const expenseQuantity = document.querySelector("aside header p span")
const expensesTotal = document.querySelector("aside header h2")

// Captura o evento de input para formatar o valor 
amount.oninput = () => {
  // Obtem o valor atual do input e remove os caracteres não numéricos.
  let value = amount.value.replace(/\D/g, "")

  //Tranforma o valor em centavos (exemplo: 150/100 = 1.5 que é equivalente a R$ 1,50).
  value = Number(value) / 100

// Atualiza o valor do input. 
  amount.value = formatCurrencyBRL(value)
}

function formatCurrencyBRL (value) {
  //Formata o valor no padrão BRL (Real Brasileiro)
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency:"BRL",
  })

  //Retorna o valor formatado
  return value
}

//Captura o evento de submit do formulario para obter os valores.
form.onsubmit = (event) => {
  //Previne o recarregamento da pagina.
  event.preventDefault()
  
  //Cria um objeto com os detalhes da nova despesas.
  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  }

    //Chama a função que vai adicionar o item na lista.
  expenseAdd(newExpense)
}

// Adiciona um novo item na lista.
function expenseAdd(newExpense){
  try {
    //Cria o elemento de li para adicionar o item na lista.
    const expenseItem = document.createElement("li")
    expenseItem.classList.add("expense")

    //Cria o icone da categoria

    const expenseIcon = document.createElement("img")
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
    expenseIcon.setAttribute("alt", newExpense.category_name)

    //Adiciona as informações no item.
    expenseItem.append(expenseIcon)

    //Cria a info da despesa.
    const expenseInfo = document.createElement("div")
    expenseInfo.classList.add("expense-info")

    //Cria o nome da despesa
    const expenseName = document.createElement("strong")
    expenseName.textContent = newExpense.expense

    //Cria a categoria da despesa.
    const expenseCategory = document.createElement("span")
    expenseCategory.textContent = newExpense.category_name

    //Adiciona nome e categoria na div das informações da despesa.
    expenseInfo.append(expenseName, expenseCategory)

    // Cria o valor da despesa.
    const expenseAmount = document.createElement("small")
    expenseAmount.classList.add("expense-amount")
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}`

    // Cria o icone de remover 
    const removeIcon = document.createElement("img")
    removeIcon.classList.add("remove-icon")
    removeIcon.setAttribute("src","img/remove.svg")
    removeIcon.setAttribute("alt", "remover")
    
    //Adiciona as informações no item.
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

    //Adiciona o item na lista.
    expenseList.append(expenseItem)


    //Limpa o formulario de item.
    resetForm()

    //Atualiza os totais.
    updateTotals()
  } catch (error) {
    alert("Não foi possivel atualizar a lista de despesas.")
    console.log(error)
  }
}

// Atualiza os totais. 
function updateTotals() {
  try {
    //Recupera todos os itens (Li) DA LISTA (UL)
    const items = expenseList.children

    // Atualiza a quantidade de itens da lista.
    expenseQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"   
    }`

    // Variavel para incrementar o total.  
    let total = 0

    // Percorre cada item li da lista
    for(let item = 0; item < items.length; item++){
      const itemAmount = items[item].querySelector(".expense-amount")
      
    //Remove caracteres numéricos e substitui a virgula pelo ponto.
      let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".")

    //Converte o valor para float.
    value = parseFloat(value)

    // Verifica se é um numero valido.
    if (isNaN(value)) {
      return alert("Não foi possivel calcular o total. O valor não parece ser um numero.")
    }

    // Incrementar o valor total.
    total += Number(value)
  } 
  
  // Cria a span para adicionar o RS formatado. 
  const symbolBRL = document.createElement("small")
  symbolBRL.textContent = "R$"

  // Formata o valor e remove o RS que será exibido pela small com um estilo customizado. 
  total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

  //Limpa o conteudo do elemento
  expensesTotal.innerHTML = ""

    // Adiciona o simbolo da moeda e o valor total formatado.
    expensesTotal.append(symbolBRL, total)

  } catch (error) {
    console.log(error)
    alert("Não foi possivel atualizar os totais.")
  }
}

// Evento que captura o clique nos itens da lista.

expenseList.addEventListener("click", function (event) {
  // Verificar se o elemento clicado é o icone de remover
  if(event.target.classList.contains("remove-icon")) {
    // Obtem a li pai do elemento clicado.
    const item = event.target.closest(".expense")
    //Remove o item da lista.
    item.remove()
  }
  //Atualiza os totais
  updateTotals()
})

function resetForm(){
  //Limpa os inputs
  expense.value = ""
  category.value = ""
  amount.value = ""
  //Coloca o foco no input do amount 
  expense.focus()
}