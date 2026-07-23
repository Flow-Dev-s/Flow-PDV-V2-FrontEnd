export function gerarCopiaEColaPix(chave: string, nome: string, cidade: string, valor: number): string {
    const format = (id: string, value: string) => {
        const size = String(value.length).padStart(2, '0');
        return `${id}${size}${value}`;
    };

    const payloadFormat = "000201";

    const merchantAccount = `0014br.gov.bcb.pix01${String(chave.length).padStart(2, '0')}${chave}`;
    const merchantAccountStr = format("26", merchantAccount);
    const merchantCategory = "52040000";
    const currency = "5303986";
    
    const amountStr = valor > 0 ? format("54", valor.toFixed(2)) : "";
    const country = "5802BR";
    
    const limpaTexto = (t: string) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9 ]/g, "");
    
    const merchantName = format("59", limpaTexto(nome).substring(0, 25).toUpperCase());
    const merchantCity = format("60", limpaTexto(cidade).substring(0, 15).toUpperCase());
    
    const additionalData = format("62", format("05", "***")); 
    
    const payloadSemCrc = `${payloadFormat}${merchantAccountStr}${merchantCategory}${currency}${amountStr}${country}${merchantName}${merchantCity}${additionalData}6304`;

    let polinomio = 0x1021;
    let resultado = 0xFFFF;
    for (let i = 0; i < payloadSemCrc.length; i++) {
        resultado ^= payloadSemCrc.charCodeAt(i) << 8;
        for (let j = 0; j < 8; j++) {
            if ((resultado & 0x8000) !== 0) {
                resultado = (resultado << 1) ^ polinomio;
            } else {
                resultado <<= 1;
            }
        }
    }
    const crc = (resultado & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
    
    return payloadSemCrc + crc;
}