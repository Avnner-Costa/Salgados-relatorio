function adicionarLinha() {

    let tbody = document.getElementById("corpoTabela");

    let linha = document.createElement("tr");

    linha.innerHTML = `
        <td><input type="date" onchange="calcular()"></td>
        <td><input type="number" min="0" onchange="calcular()"></td>
        <td><input type="number" step="0.01" min="0" onchange="calcular()"></td>
        <td>
            <button class="excluir" onclick="removerLinha(this)">
                X
            </button>
        </td>
    `;

    tbody.appendChild(linha);
}

function removerLinha(botao){
    botao.parentElement.parentElement.remove();
    calcular();
}

function calcular(){

    let qtdTotal = 0;
    let valorTotal = 0;

    let linhas = document.querySelectorAll("#corpoTabela tr");

    linhas.forEach(linha => {

        let qtd =
        parseFloat(
            linha.cells[1]
            .querySelector("input").value
        ) || 0;

        let unitario =
        parseFloat(
            linha.cells[2]
            .querySelector("input").value
        ) || 0;

        let totalPedido = qtd * unitario;

        linha.cells[3].innerText =
        totalPedido.toLocaleString(
            "pt-BR",
            {
                style:"currency",
                currency:"BRL"
            }
        );

        qtdTotal += qtd;
        valorTotal += totalPedido;
    });

    document.getElementById("totalQtd").innerText =
    qtdTotal;

    document.getElementById("totalValor").innerText =
    valorTotal.toLocaleString(
        "pt-BR",
        {
            style:"currency",
            currency:"BRL"
        }
    );
}

function gerarPDF() {

    const { jsPDF } = window.jspdf;

    let doc = new jsPDF();

    let cliente = document.getElementById("cliente").value;
    let inicio = document.getElementById("inicio").value;
    let fim = document.getElementById("fim").value;

    // Cabeçalho
    doc.setFillColor(217, 119, 6);
    doc.rect(0, 0, 210, 30, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont(undefined, "bold");
    doc.text("BENDITA SALGADOS", 105, 15, { align: "center" });

    doc.setFontSize(11);
    doc.text("Relatório de Pedidos", 105, 23, {
        align: "center"
    });

    // Informações do cliente
    doc.setTextColor(0, 0, 0);

    doc.setFontSize(12);

    doc.setFont(undefined, "bold");
    doc.text("Cliente:", 15, 45);

    doc.setFont(undefined, "normal");
    doc.text(cliente || "-", 40, 45);

    doc.setFont(undefined, "bold");
    doc.text("Período:", 15, 55);

    doc.setFont(undefined, "normal");
    doc.text(`${inicio} até ${fim}`, 40, 55);

    // Monta dados da tabela
    let dados = [];

    document.querySelectorAll("#corpoTabela tr").forEach(linha => {

        let data = linha.cells[0].querySelector("input").value;

        let qtd = linha.cells[1].querySelector("input").value;

        let valor = linha.cells[2].querySelector("input").value;

        dados.push([
            data,
            qtd,
            Number(valor).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            })
        ]);
    });

    // Tabela profissional
    doc.autoTable({
        startY: 70,

        head: [
            ["Data", "Quantidade", "Valor"]
        ],

        body: dados,

        theme: "grid",

        headStyles: {
            fillColor: [230, 126, 34],
            textColor: [255, 255, 255],
            halign: "center"
        },

        alternateRowStyles: {
            fillColor: [253, 235, 208]
        },

        styles: {
            fontSize: 10,
            cellPadding: 4
        }
    });

    let finalY = doc.lastAutoTable.finalY + 15;

    // Caixa resumo
    doc.setFillColor(253, 235, 208);

    doc.roundedRect(
        15,
        finalY,
        180,
        30,
        3,
        3,
        "F"
    );

    doc.setFont(undefined, "bold");
    doc.setFontSize(14);

    doc.text("RESUMO", 20, finalY + 10);

    doc.setFontSize(11);

    doc.text(
        `Total de Unidades: ${document.getElementById("totalQtd").innerText}`,
        20,
        finalY + 20
    );

    doc.text(
        `Valor Total: ${document.getElementById("totalValor").innerText}`,
        110,
        finalY + 20
    );

    // Rodapé
    let dataAtual = new Date().toLocaleDateString("pt-BR");

    doc.setFontSize(9);

    doc.setTextColor(100);

    doc.text(
        `Emitido em ${dataAtual}`,
        15,
        285
    );

    doc.text(
        "Bendita Salgados",
        195,
        285,
        { align: "right" }
    );

    doc.save(
        `Relatorio-${cliente || "Cliente"}.pdf`
    );
}

function adicionarLinha() {

    let tbody = document.getElementById("corpoTabela");

    let linha = document.createElement("tr");

    linha.innerHTML = `
        <td>
            <input type="date" onchange="calcular()">
        </td>

        <td>
            <input type="number" min="0"
            onchange="calcular()">
        </td>

        <td>
            <input type="number"
            step="0.01"
            min="0"
            onchange="calcular()">
        </td>

        <td class="valorTotalPedido">
            R$ 0,00
        </td>

        <td>
            <button class="excluir"
            onclick="removerLinha(this)">
                X
            </button>
        </td>
    `;

    tbody.appendChild(linha);
}