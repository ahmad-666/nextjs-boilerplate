import Card from ".";
import CardActions from "../CardActions";
import CardContent from "../CardContent";
import CardHeader from "../CardHeader";

export default function Example() {
  //color prop act as bg-color
  //rounded prop act as border-radius
  //density prop act as padding
  //elevation,flat prop act as box-shadow
  return (
    <div>
      <Card color="card" rounded="lg" density="lg" elevation="lg">
        <CardHeader>
          <h1>header</h1>
        </CardHeader>
        <CardContent>
          <h2>Content</h2>
        </CardContent>
        <CardActions>
          <h3>Actions</h3>
        </CardActions>
      </Card>
    </div>
  );
}
