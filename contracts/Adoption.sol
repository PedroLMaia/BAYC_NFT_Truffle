pragma solidity ^0.5.0;

contract Adoption {
    //Variável para armazenar o endereço do vendendor/adm contrato.
    address payable private vendendor;

    //Variável para armazenar o endereço do comprador.
    address[16] public comprador;

    //Construtor para adicionar o vendedor no deployment do contrato, assim capturando o seu endereço.
    constructor() public {
        //Faz do vendendor a pessoa que gerencia o contrato.
        vendendor = msg.sender;
    }

    //Funcao para fazer a transacao de venda de um Ape.
    function adopt(uint petId) public payable returns (uint) {
        //Requer o id do Ape no range de 0 - 15.
        require(petId >= 0 && petId <= 15);
        //Requer um valor de ether para comprar o Ape.
        require(msg.value > 0 ether);
        //O endereco do comprado vai ser atrelado a venda daquele Ape.
        comprador[petId] = msg.sender;
        //O vendedor recebera o seu dionheiro.
        vendendor.transfer(address(this).balance);
        //Vai retorna o Ape comprado.
        return petId;
    }

    //Funcao que retornara os Ape ja comprados.
    function getAdopters() public view returns (address[16] memory) {
        return comprador;
    }

    // Valida se o participante que está enviando o eth seja o vendendor.
    modifier restricted() {
        require(msg.sender == vendendor);
        _;
    }

}