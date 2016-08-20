window.onload = function() {
    var width = document.getElementById('width');
    var height = document.getElementById('height');
    var diagonal = document.getElementById('diagonal');
    var tbody = document.getElementById('tbody');
    var remember = document.getElementById('remember');
    var self = document.getElementById('self');
    var inputs = document.querySelectorAll('.input');
    var links = document.querySelectorAll('.list-group-item');
    var devicePixelRatio = window.devicePixelRatio || 1;

    var table = document.getElementById('table');
    var sort = new Tablesort(table);

    /**
     * Create eventListener for each links and replace values
     */
    for (var i=0;i<links.length;i++) {
        link = links[i];
        link.addEventListener('click', function(link) {
            for (var j=0;j<links.length;j++) {
                link = links[j];
                link.classList.remove('active');
            }
            this.classList.add('active');
            width.value = this.dataset.width;
            height.value = this.dataset.height;
            if (this.dataset.diagonal) {
                diagonal.value = this.dataset.diagonal;
            }
            update();
        });
    }

    remember.addEventListener('click', function() {
        addRow();
    });

    self.addEventListener('click', function() {
        myScreen();
    });


    for (var i = 0; i < inputs.length; i++) {
        input = inputs[i];
        input.addEventListener('input', function() {
            update();
        });
    }

    /**
     *  Update and show if needed the result
     */
    function update() {
        var p = document.getElementById('result');

        if (!hasErrors()) {
            p.classList.remove('hidden');
            var info = getInfo();
            p.innerHTML = "Informations de l'écran : <strong>" + info.width + "</strong> cm x <strong>" + info.height + "</strong> cm (<strong>" + info.surface + "</strong> cm²) à <strong>" + info.ppi + "</strong> PPI soit <strong>" + info.pixels + "</strong> pixels. Retina à partir de <strong>" + info.viewDistance + "</strong> cm.";
        }
        else {
            p.classList.add('hidden');
        }
    }

    /**
     * Add row to the table
     */
    function addRow() {
        if (!hasErrors()) {
            var info = getInfo();
            var row = tbody.insertRow(0);
            var cell = row.insertCell(0);
            var cell1 = row.insertCell(1);
            var cell2 = row.insertCell(2);
            var cell3 = row.insertCell(3);
            var cell4 = row.insertCell(4);
            var cell5 = row.insertCell(5);

            cell.innerHTML = width.value + " px";
            cell1.innerHTML = height.value + " px";
            cell2.innerHTML = info.diagonal + "\"";
            cell3.innerHTML = info.ppi + " PPI";
            cell4.innerHTML = info.pixels;
            cell5.innerHTML = info.viewDistance + " cm";

            sort.refresh();
        }
    }

    function getInfo() {
        return {
            width: roundToTwo(getScreenWidth()),
            height: roundToTwo(getScreenHeight()),
            diagonal: diagonal.value,
            surface: roundToTwo(getScreenWidth() * getScreenHeight()),
            ppi: roundToTwo(getScreenPPI()),
            pixels: numberWithSpaces(width.value * height.value),
            viewDistance: roundToTwo(inchToCm(getViewDistance()))
        };
    }

    /**
     * Check if inputs are valid values and add class error if needed
     * @return boolean
     */
    function hasErrors(){

        if (width.value != "" && !isNaN(width.value)) {
            width.parentElement.classList.remove('has-error');
        }
        else {
            width.parentElement.classList.add('has-error');
        }

        if (height.value != "" && !isNaN(height.value)) {
            height.parentElement.classList.remove('has-error');
        }
        else {
            height.parentElement.classList.add('has-error');
        }

        if (diagonal.value != "" && !isNaN(diagonal.value)) {
            diagonal.parentElement.classList.remove('has-error');
        }
        else {
            diagonal.parentElement.classList.add('has-error');
        }

        if(width.value != "" && height.value != "" && diagonal.value != "" && !isNaN(width.value) && !isNaN(height.value) && !isNaN(diagonal.value)){
            return false;
        }
        return true;
    }

    /**
     * Display value for the current screen
     */
    function myScreen() {
        width.value = screen.width * devicePixelRatio;
        height.value = screen.height * devicePixelRatio;
        update();
    }

    function getScreenWidth() {
        // Width = √ (( Diagonale )² / ( 1 + 1 / Rp² ))
        return Math.sqrt(Math.pow(getMetricDiagonal(), 2) / (1 + 1 / Math.pow((getRatio()), 2)));
    }

    function getScreenHeight() {
        // Height = √ (( Diagonale )²/ ( Rp² + 1 ))
        return Math.sqrt(Math.pow(getMetricDiagonal(), 2) / (Math.pow((getRatio()), 2) + 1 ));
    }

    function getScreenPPI() {
        // resolution = √ (( width )² + ( height )²) / diagonal
        return (Math.sqrt((Math.pow(width.value, 2) + Math.pow(height.value, 2))) / diagonal.value);
    }

    function getViewDistance() {
        return 3438 / getScreenPPI();
    }

    function getRatio() {
        return (width.value / height.value);
    }

    function getMetricDiagonal() {
        return inchToCm(diagonal.value);
    }

    function roundToTwo(num) {
        return +(Math.round(num + "e+2")  + "e-2");
    }

    function inchToCm(value) {
        return (value * 2.54);
    }

    function numberWithSpaces(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
}
