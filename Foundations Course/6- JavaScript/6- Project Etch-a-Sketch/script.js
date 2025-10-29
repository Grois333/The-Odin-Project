// Create a sketchpad (default 16x16), allow resizing via a button,
// and implement random color + progressive darkening (10% per hover).

// Wait for DOM ready
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('grid-container');
    const btn = document.getElementById('resize-btn');

    // create initial grid
    createGrid(16);

    // When user clicks button, prompt for new size and recreate grid
    btn.addEventListener('click', () => {
        let input = prompt('Enter squares per side (max 100):', '16');
        if (input === null) return; // user cancelled
        let n = parseInt(input, 10);
        if (isNaN(n) || n < 1) {
            alert('Please enter a valid positive number.');
            return;
        }
        if (n > 100) n = 100;
        createGrid(n);
    });

    // createGrid: removes existing squares and populates new ones
    function createGrid(n) {
        // Clear previous content
        container.innerHTML = '';

        // Determine the size of each square so the full grid fits container
        // container.clientWidth is controlled by CSS var --container-size (960px)
        const containerSize = container.clientWidth;
        // compute integer pixel size (floor to ensure fit)
        const squareSize = Math.floor(containerSize / n);

        // create n*n squares
        const total = n * n;
        for (let i = 0; i < total; i++) {
            const sq = document.createElement('div');
            sq.className = 'grid-square';
            // set exact size so squares form a grid
            sq.style.width = `${squareSize}px`;
            sq.style.height = `${squareSize}px`;
            // store state for progressive darkening:
            // data-original -> "r,g,b" when first assigned
            // data-darkness -> integer 0..10 (how many steps applied)
            sq.dataset.darkness = '0';

            // on hover (mouseenter) we apply color and darken by 10%
            sq.addEventListener('mouseenter', handleEnter);

            container.appendChild(sq);
        }
    }

    // handleEnter: assign a random color if needed and darken progressively
    function handleEnter(e) {
        const el = e.currentTarget;

        // retrieve or create original color
        let original = el.dataset.original; // format "r,g,b"
        if (!original) {
            // randomize rgb and store as original
            const r = randInt(0, 255);
            const g = randInt(0, 255);
            const b = randInt(0, 255);
            original = `${r},${g},${b}`;
            el.dataset.original = original;
            // start at 0 darkness; next we will increment to 1 and apply 10%
            el.dataset.darkness = '0';
        }

        // increment darkness by 1 step (max 10)
        let darkness = parseInt(el.dataset.darkness, 10) || 0;
        if (darkness < 10) darkness++;
        el.dataset.darkness = String(darkness);

        // apply color darker by darkness*10% (linear towards black)
        const [r, g, b] = original.split(',').map(Number);
        const factor = 1 - (darkness / 10); // 1 -> original, 0 -> black at darkness=10
        const rr = Math.round(r * factor);
        const gg = Math.round(g * factor);
        const bb = Math.round(b * factor);

        el.style.backgroundColor = `rgb(${rr}, ${gg}, ${bb})`;
    }

    // helper random int inclusive
    function randInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
});