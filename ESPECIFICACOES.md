##### &#x20;                               **PROJETO APP CLASSE IMO (14.04.2026)**



**============================================================================================================================================================**

**PROMPT INICIAL:**



**O presente projeto tem o objetivo final de Determinar a Classe do Ativo Imobilizado,  a partir dos Dados constantes da Planilha Anexa.**



**Inicialmente você realizara e implementação no formato HTML/CSS.**



**Em um segundo momento, criaremos um App com saída APK.**



**Utilizaremos inicialmente como modelo, a imagem anexa.**



============================================================================================================================================================                                                								**ESPECIFICAÇÕES TÉCNICAS**

============================================================================================================================================================



Critérios para definição das Classes de Imobilizado:



**Abas: UAR, Centros de Custo e DEPARA**



**1º Critério de Definição:**



* A primeira informação a ser fornecida no App, será a UAR (Unidade de Adição e Retirada), da Aba UAR, que deverá possuir lista suspensa com o conteúdo da coluna A (UAR). Este campo deverá permitir a colagem de dados;
* Os dois primeiros dígitos de cada UAR, são chamados de UP ou Família do Ativo, exemplo UAR 0100001 TERRENO, UP = 01 e deverá ser definida, toda vez que o campo UAR é populado. 
* Com a UP (coluna E) definida , atribua o valor do campo da coluna F (Descrição) a variável DescUP e já conseguimos mapear todas as possíveis Classes na Aba DEPARA, coluna B (Para: Classe Atual).
* Vá até a coluna B (Descrição) da Aba UAR e atribua o valor do campo a variável DescUAR, para a respectiva UAR selecionada;
* Se a UAR for 9100300 a variável CA (Classe Ativo) será F1402000 e respectiva descrição deverá ser atribuída a variável DescUP com valor igual a "DIREITO DE USO – CPC06", se a UAR for 9100950 a variável CA (Classe Ativo) será F1404000 e respectiva descrição deverá ser atribuída a variável DescUP com valor igual a "EXTERNALIDADE", se a UAR for 9100900 a variável CA (Classe Ativo) será F1406000 e respectiva descrição deverá ser atribuída a variável DescUP com valor igual a "DIREITO DE USO – SOFTWARE" e se a UAR for 9100800 a variável CA (Classe Ativo) será F1407000 e respectiva descrição deverá ser atribuída a variável DescUP com valor igual a "INFRA ESTRUTURA PARA ENERGIZAÇÃO ELÉTRICA".



**2º Critério de Definição:**



* A segunda Informação a ser fornecida no App, será o Centro de Custo Solicitante, da Aba Centros de Custo, que deverá possuir também lista suspensa com o conteúdo da Coluna A (Centro de Custo). Este campo deverá permitir a colagem de dados e será atribuído à variável CC;
* Agora vá até a coluna U (Descrição) e atribua o valor do campo a variável DescCC;
* A partir do Centro de Custo (CC), localize o respectivo Centro de Lucro na Aba Centros de Custo, coluna Q (Centro de lucro);
* Extraia a sétima letra deste campo e atribua a variável CL;
* Agora, se CL = A atribua o valor "Água" a variável DescCL, se CL = E, atribua o valor "Esgoto" a variável DescCL, se CL = G, atribua o valor "Geral" a variável DescCL e se CL = 0, atribua o valor "Imobilizado".
* A partir do Centro de Custo (CC), localize o respectivo Tipo de Contrato na Aba Centros de Custo, coluna E (Tipo contrato) e atribua o valor a variável TC;
* Agora se TC = U, atribua o valor "URAE" a variável DescTC e se TC = O, atribua o valor "Outros" a variável DescTC.



**3º Critério de Definição:**



* A partir do Centro de Custo (CC), localize o respectivo Tipo de Centro de Custo na Aba Centros de Custo, coluna F (Tipo centro custo) e atribua o valor a variável TCC;
* Agora se TCC = E, atribua o valor "Tratamento de Água" a variável DescTCC, se TCC = F, se atribua o valor "Distribuição" a variável DescTCC, se TCC = H,  atribua o valor "Coleta" a variável DescTCC, se TCC = I,  atribua o valor "Tratamento de Esgoto" a variável DescTCC, se TCC = L,  atribua o valor "Adm. Operação" a variável DescTCC, se TCC = M,  atribua o valor "Comercial" a variável DescTCC, se TCC = N,  atribua o valor "Corporativo" a variável DescTCC e se TCC = Z,  atribua o valor "Laboratórios" a variável DescTCC.



**4º Definição Prévia:**



* Se CL for igual a A, ou CL for igual a E ou CL for igual a G:
* Considerando a concatenação CL\&TC escolha a Classe correta na coluna B (Para: Classe Atual) da Aba DEPARA, utilizando como critério de escolha a variável TCC. Atribua o resultado escolhido a variável CA;
* Se CL for igual a A, ou CL for igual a E ou CL for igual a G a UP for igual a 01 e TCC for igual a -, atribua o valor PI129500 a variável CA
* Se CL for igual a A, ou CL for igual a E ou CL for igual a G a UP for igual a 02 e TCC for igual a -, atribua o valor PI129501 a variável CA
* 10Se CL for igual a 0:
* Escolha a Classe na coluna B (Para: Classe Atual) da Aba DEPARA e atribua o resultado escolhido a variável CA;



**5º Validações:**



* Se a UP for igual a 10 e CL for diferente de A, CA passará a ser "Incompatível" e DescUP passará a ser "UAR Incompatível com o Centro de **Custo";**
* Se a UAR for a 1100001 e CL for diferente de A, CA passará a ser "Incompatível" e DescUP passará a ser "UAR Incompatível com o Centro de **Custo";**
* Se a UAR for a 1100003 e CL for diferente de E, CA passará a ser "Incompatível" e DescUP passará a ser "UAR Incompatível com o Centro de **Custo";**
* Se UP for a 02 e CL for igual a 0, CA passará a ser "Incompatível" e DescUP passará a ser "UAR Incompatível com o Centro de **Custo";**
* Se UP for a 04 e CL for igual a 0, CA passará a ser "Incompatível" e DescUP passará a ser "UAR Incompatível com o Centro de **Custo";**
* Se UP for a 07 e CL for igual a 0, CA passará a ser "Incompatível" e DescUP passará a ser "UAR Incompatível com o Centro de **Custo";**
* Se a UAR for a 0800221 e CL for diferente de A, CA passará a ser "Incompatível" e DescUP passará a ser "UAR Incompatível com o Centro de **Custo";**
* Se a UAR for a 0800585 e CL for diferente de A, CA passará a ser "Incompatível" e DescUP passará a ser "UAR Incompatível com o Centro de **Custo";**
* Se a UAR for a 0800103 e CL for diferente de E, CA passará a ser "Incompatível" e DescUP passará a ser "UAR Incompatível com o Centro de **Custo";**
* Se a UAR for a 0800166 e CL for diferente de E, CA passará a ser "Incompatível" e DescUP passará a ser "UAR Incompatível com o Centro de **Custo";**
* Se a UAR for a 0905902 e CL for diferente de E, CA passará a ser "Incompatível" e DescUP passará a ser "UAR Incompatível com o Centro de **Custo";**
* Se a UAR for a 0926730 e CL for diferente de E, CA passará a ser "Incompatível" e DescUP passará a ser "UAR Incompatível com o Centro de **Custo";**
* Se a UAR for a 0200064 e CL for diferente de E, CA passará a ser "Incompatível" e DescUP passará a ser "UAR Incompatível com o Centro de **Custo";**
* Se a UAR for a 0800080 e CL for diferente de E, CA passará a ser "Incompatível" e DescUP passará a ser "UAR Incompatível com o Centro de **Custo";**
* Se a UAR for a 0800103 e CL for diferente de E, CA passará a ser "Incompatível" e DescUP passará a ser "UAR Incompatível com o Centro de **Custo";**
* Se a UAR for a 0800111 e CL for diferente de E, CA passará a ser "Incompatível" e DescUP passará a ser "UAR Incompatível com o Centro de **Custo";**
* Se a UAR for a 0922100 e CL for diferente de A, CA passará a ser "Incompatível" e DescUP passará a ser "UAR Incompatível com o Centro de **Custo";**



**6º Definição Final:**



**A Classe do Ativo é: CA**



**A Descrição da Classe do Ativo é: DescUP**



**Se CA é diferente de "Incompatível":**



**Vá até a coluna H (Forma de Controle) da Aba DEPARA e atribua o valor do campo a variável FC;**



**Vá até a coluna I (Tipo de Bem) da Aba DEPARA e atribua o valor do campo a variável GB;**



**Vá até a coluna J (Unidade Medida) da Aba DEPARA e atribua o valor do campo a variável UM;**



**Vá até a coluna C (Responsável) da Aba Centros de Custo e atribua o valor do campo a variável NomeAprov;**



**Vá até a coluna AD (Usuário responsável) da Aba Centros de Custo e atribua o valor do campo a variável Mat;**



**Se CA é igual a "Incompatível", as variáveis FC, GB, UM, NomeAprov e Mat ficarão vazias.**



**============================================================================================================================================================**



**MELHORIA LAYOUT 01:**



1. substitua os dois logos atuais pelos do arquivo:"C:\\Users\\Wayon\\OneDrive - WAYON IT SOLUTIONS\\Documentos\\claude\_cowork\\02 Projects\\APP Classe IMO\\lgosabesp.jpg"
2. Substitua a imagem do canto superior direito pela imagem do arquivo:"C:\\Users\\Wayon\\OneDrive - WAYON IT SOLUTIONS\\Documentos\\claude\_cowork\\02 Projects\\APP Classe IMO\\imgemsuperiordireita.jpg"
3. Centralize na horizontal os campos CC e UAR e altere a cor das molduras e das respectivas grafias para #1D4166
4. Mude a cor das grafias dos campos TC, TCC e CL para #1D4166
5. Movimente os campos DescCC, DescUAR, DescTC, DescTCC e DescCL mais para direita, de formas a torná-los mais centralizados dentro do espaço restante
6. Retire as "linhas de Grade" do espaço compreendido entre Centro de Custo e o botão "DETERMINAR CLASSE"
7. Mude a borda do Botão "DETERMINAR CLASSE", e a cor da grafia para o amarelo (#FFFF00) além de centralizar a grafia em relação à vertical
8. Uniformize o traço à direita dos campos FC e GB com o da linha superior
9. Altere a cor da grafia do campo CA para a cor amarela (#FFFF00)
10. Uniformize o traço à direita do campo Mat com o da linha superior
11. Crie um pequeno tutorial passo a passo e conciso de como o usuário deve proceder para Determinar a Classe do Ativo e acesse-o através de um link associado à palavra "Ajuda" localizada no canto inferior esquerdo.



\------------------------------------------------------------------------------------------------------------------------------------------------------------



**MELHORIA LAYOUT 02:**



1. Aplique a borda externa esquerda em azul de forma uniforme às demais bordas de formas a formar uma espécie de quadrilátero
2. Reduza verticalmente a parte superior (Hero), onde ficam o logo sabesp a grafia "Definir a Classe do Ativo" e a imagem superior direita, de forma proporcional, aumentando o logo sabesp, e a grafia "Definir a Classe do Ativo" e embutindo a parte superiro da imagem superior direita na borda
3. Crie o Botão "LIMPAR" ao lado direito do botão DETERMINAR CLASSE, com a mesma configuração do botão DETERMINAR CLASSE, mas com a cor de fundo #12CDFF e a grafia #FFFFFF, cuja função é dar um reset, limpando todos os campos preenchidos
4. Prolongue o traço acima do campo NomeAprov até encontrar a moldura
5. Prolongue o traço à direita do campo Mat até encontrar a moldura
6. Todos os traçados à direita e abaixo que estão próximos às respectivas molduras, precisam se conectar às mesmas
7. Atualize a página de Ajuda



\------------------------------------------------------------------------------------------------------------------------------------------------------------



**MELHORIA LAYOUT 03:**



1. Faça a união dos dois traços verticais da parte inferior do layout respectivamente com os traços a direita do Botão CA e a direita do campo Mat





**MELHORIA LAYOUT 04:**



1. Use como parâmetro a imagem: "C:\\Users\\Wayon\\OneDrive - WAYON IT SOLUTIONS\\Documentos\\claude\_cowork\\02 Projects\\APP Classe IMO\\MELHORIALAYOUT04.png"
2. No local delimitado pelo retângulo verde, insira a grafia "GAC: Conformidade de Ativos Regulatórios" com a fonte na cor #12CDFF
3. Alinhe o seguimento de reta do lado esquerdo do campo GB, com o seguimento de reta ao lado direito do botão CA, de forma a formarem um único seguimento de reta
4. Retire o seguimento de reta circundado por uma elipse na cor vermelha





**MELHORIA LAYOUT 05 (V3):**



1. Centralize os campos TC, TCC e CL tomando como base, a dimensão horizontal do campo UAR
2. Alinhe o seguimento de reta do lado esquerdo do campo GB, com o seguimento de reta ao lado direito do botão CA, de forma a formarem um único seguimento de reta
3. Atualmente, quando a página é iniciada ou reiniciada, todos os campos aparecem com a grafia "-", faça com que nestas condições a grafia fique em branco " "
4. A grafia de todos os campos deve vir na cor #1E3A5F, exceto quando a Classe do Ativo CA, apresentar o resultado "Incompatível".





**MELHORIA LAYOUT 06 (V3):**



1. Substitua o logo superior esquerdo atual pelo logo da imagem: "C:\\Users\\Wayon\\OneDrive - WAYON IT SOLUTIONS\\Documentos\\claude\_cowork\\02 Projects\\APP Classe IMO\\logopng.pngbg.png"
2. A grafia de todos os campos deve vir na cor #00B4D8, exceto quando a Classe do Ativo CA, apresentar o resultado "Incompatível".





**MELHORIA LAYOUT 07 (V3):**



1. Substitua o logo superior esquerdo atual pelo logo da imagem: "C:\\Users\\Wayon\\OneDrive - WAYON IT SOLUTIONS\\Documentos\\claude\_cowork\\02 Projects\\APP Classe IMO\\lgosabesppng2-removebg-preview.png"
2. Remova a linha horizontal no topo, logo abaixo do texto "Definir a Classe do Ativo"
3. Centralize o Texto ". GAC: CONFORMIDADE DE ATIVOS REGULATÓRIOS" em relação às bordas verticais e retire o "." da grafia final











Lottie, Three.js, Tailwind CSS, 









