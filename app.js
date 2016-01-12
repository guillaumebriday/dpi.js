window.onload = function() {
    var width = document.getElementById('width');
    var height = document.getElementById('height');
    var diagonal = document.getElementById('diagonal');
    var tbody = document.getElementById('tbody');
    var remember = document.getElementById('remember');
    var self = document.getElementById('self');
    var inputs = document.querySelectorAll('.input');
    var links = document.querySelectorAll('.list-group-item');


    /**
     * Create eventListener for each links and replace values
     */
    for(var i=0;i<links.length;i++){
        link = links[i];
        link.addEventListener('click', function(link){
            width.value = this.dataset.width;
            height.value = this.dataset.height;
            update();
        });
    }

    width.focus();

    remember.addEventListener('click', function(){
        addRow();
    });

    self.addEventListener('click', function(){
        myScreen();
    });


    for(var i = 0; i < inputs.length; i++){
        input = inputs[i];
        input.addEventListener('input', function(){
            update();
        });
    }

    /**
     *  Update and show if needed the result
     */
    function update(){
        var p = document.getElementById('result');

        if(checkError()){
            p.classList.remove('hidden');
            diagonal.value = diagonal.value.replace(',', '.');
            surface = roundToTwo(calculWidth() * calculHeight());
            p.innerHTML = "Informations de l'écran : <strong>" + calculWidth() + "</strong> cm x <strong>" + calculHeight() + "</strong> cm ( <strong>" + surface + "</strong> cm² ) à <strong>" + calculPPI() + "</strong> PPI";
        } else {
            p.classList.add('hidden');
        }
    }

    /**
     * Add row to the table
     */
    function addRow(){
        if(checkError()){
            var row = tbody.insertRow(0);
            var cell = row.insertCell(0);
            var cell1 = row.insertCell(1);
            var cell2 = row.insertCell(2);
            var cell3 = row.insertCell(3);

            cell.innerHTML = width.value;
            cell1.innerHTML = height.value;
            cell2.innerHTML = diagonal.value;
            cell3.innerHTML = calculPPI();
        }
    }

    function calculPPI(){
        return roundToTwo((height.value/Math.sqrt(Math.pow(diagonal.value,2)/(Math.pow((width.value/height.value),2)+1))));
    }

    function diagonalMetric(){
        return roundToTwo((diagonal.value * 2.54));
    }

    function calculHeight(){
        diagonalMetre = diagonalMetric();
        return roundToTwo(Math.sqrt(Math.pow(diagonalMetre, 2) / (Math.pow((width.value / height.value), 2) + 1 ))); // Hauteur = √ ( ( Diagonale )²/ ( Rp² + 1 ) )
    }

    function calculWidth(){
        diagonalMetre = diagonalMetric();
        return roundToTwo(Math.sqrt(Math.pow(diagonalMetre, 2) / (1+1 / Math.pow((width.value / height.value), 2)))); // Longueur = √ ( ( Diagonale )² / ( 1 + 1 / Rp² ))s
    }


    /**
     * Check if inputs are valid values and add class error if needed
     * @return boolean
     */
    function checkError(){

        if(width.value != "" && !isNaN(width.value)){
            width.parentElement.classList.remove('has-error');
        }
        else {
            width.parentElement.classList.add('has-error');
        }

        if(height.value != "" && !isNaN(height.value)){
            height.parentElement.classList.remove('has-error');
        }
        else {
            height.parentElement.classList.add('has-error');
        }

        if(diagonal.value != "" && !isNaN(diagonal.value)){
            diagonal.parentElement.classList.remove('has-error');
        }
        else {
            diagonal.parentElement.classList.add('has-error');
        }

        if(width.value != "" && height.value != "" && diagonal.value != "" && !isNaN(width.value) && !isNaN(height.value) && !isNaN(diagonal.value)){
            return true;
        }
        return false;
    }

    /**
     * Display value for the current screen
     */
    function myScreen() {
        width.value = screen.width;
        height.value = screen.height;
        update();
    }

    function roundToTwo(num) {
        return +(Math.round(num + "e+2")  + "e-2");
    }

}
