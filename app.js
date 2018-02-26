class Environment {
    constructor (width, height) {
        this.obstacles = [];
        this.width = width;
        this.height = height;
        this.minObstacleSize = 0.1;
        this.maxObstacleSize = 0.2;
    }

    addObstacle () {
        const width = (this.minObstacleSize + (Math.random() * (this.maxObstacleSize - this.minObstacleSize))) * this.width;
        const height = (this.minObstacleSize + (Math.random() * (this.maxObstacleSize - this.minObstacleSize))) * this.height;
        const x = Math.random() * (this.width - width);
        const y = Math.random() * (this.height - height);
        const obstacle = new Obstacle(x, y, width, height);

        this.obstacles.push(obstacle);
    }
}

class EnvironmentContainer extends createjs.Container {
    constructor (environment) {
        super();

        this.environment = environment;

        for (let i = 0; i < this.environment.obstacles.length; i++)
            this.addChild(new ObstacleShape(this.environment.obstacles[i]));
    }
}

class Obstacle {
    constructor (x = 0, y = 0, width, height, minVertices = 3, maxVertices = 8) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.minVertices = minVertices;
        this.maxVertices = maxVertices;
        this.vertices = [];

        this.addVertices();
    }

    addVertices () {
        const vertexCount = this.minVertices + Math.floor(Math.random() * (this.maxVertices - this.minVertices + 1));

        let radius;

        if (this.width < this.height)
            radius = this.width;
        else
            radius = this.height;

        radius /= 2;

        let x;
        let y;
        let angle = 0;
        let i = 0;
        const minAngle = (2 * Math.PI) / (vertexCount * 2);
        const maxAngle = 2 * (2 * Math.PI) / vertexCount;

        do {
            x = Math.cos(angle) * radius;
            y = Math.sin(angle) * radius;
            this.vertices.push({ x, y });
            
            i++;

            if (i == vertexCount)
                break;

            const remainingAngle = (2 * Math.PI) - angle;

            let angleDelta;

            if (remainingAngle < maxAngle)
                angleDelta = Math.random() * remainingAngle;
            else
                angleDelta = minAngle + (Math.random() * (maxAngle - minAngle));

            angle += angleDelta;
        } while (true);
    }
}

class ObstacleShape extends createjs.Shape {
    constructor (obstacle) {
        super();

        this.obstacle = obstacle;

        this.x = obstacle.x;
        this.y = obstacle.y;

        let vertex = obstacle.vertices[0];

        this.graphics.beginStroke('black').moveTo(vertex.x, vertex.y);

        for (let i = 0; i < obstacle.vertices.length - 1; i++) {
            vertex = obstacle.vertices[i];

            this.graphics.lineTo(vertex.x, vertex.y);
        }

        vertex = obstacle.vertices[0];
        this.graphics.lineTo(vertex.x, vertex.y);
    }
}

class Pathfinder {
    constructor () {
    }
}

class PathfinderAnimation {
    constructor (pathfinder, canvas) {
        this.stage = new createjs.Stage(canvas);
        
        const environment = new Environment(canvas.width, canvas.height);
        
        for (let i = 0; i < 50; i++)
            environment.addObstacle();

        const environmentContainer = new EnvironmentContainer(environment, this.stage);

        this.stage.addChild(environmentContainer);

        createjs.Ticker.on('tick', this.tick.bind(this));
    }

    tick () {
        this.stage.update();
    }
}

function init () {
    const canvas = document.createElement('canvas');
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
    canvas.style.position = 'absolute';
    canvas.style.left = 0;
    canvas.style.top = 0;
    document.getElementsByTagName('body')[0].appendChild(canvas);

    const pathfinder = new PathfinderAnimation(new Pathfinder(), canvas);
}