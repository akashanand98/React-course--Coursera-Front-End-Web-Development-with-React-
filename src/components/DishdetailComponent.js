import React ,{Component} from 'react';
import { Card, CardImg, CardText, CardBody,
    CardTitle, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Navbar, NavbarBrand, Nav, NavbarToggler, Collapse, NavItem, Jumbotron,
        Button, Modal, ModalHeader, ModalBody,Row, Col,
        Form, FormGroup, Input, Label } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';




const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);

class CommentForm extends Component
{
  constructor(props) {
      super(props);


       this.toggleModal = this.toggleModal.bind(this);
       this.handleComment = this.handleComment.bind(this);

      this.state = {
        isModalOpen: false
      };
    }


    toggleModal() {
      this.setState({
        isModalOpen: !this.state.isModalOpen
      });
    }


    handleComment(values) {
      this.toggleModal();
      this.props.addComment(this.props.dishId, values.rating, values.author, values.comment);

    }

    render()
    {
      return(
        <div>
        <Nav className="ml-auto" navbar>
            <NavItem>
                <Button outline onClick={this.toggleModal} ><span className="fa fa-pencil fa-lg"></span> Submit Comment</Button>
            </NavItem>
        </Nav>
        <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
            <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
            <ModalBody>
            <LocalForm onSubmit={(values) => this.handleComment(values)}>
             <Row className="form-group">
                <Label htmlFor="rating" md={2}>Rating</Label>
                <Col md={10}>
                <Control.select model=".rating" name="rating"
                className="form-control">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                </Control.select>
                </Col>
             </Row>

            <Row className="form-group">
                    <Label htmlFor="author" md={2}>Your Name</Label>
                    <Col md={10}>
                        <Control.text model=".author" id="author" name="author"
                            placeholder="Your Name"
                            className="form-control"
                            validators={{
                                required, minLength: minLength(3), maxLength: maxLength(15)
                            }}
                             />
                        <Errors
                            className="text-danger"
                            model=".author"
                            show="touched"
                            messages={{
                                required: 'Required',
                                minLength: 'Must be greater than 2 characters',
                                maxLength: 'Must be 15 characters or less'
                            }}
                         />
                    </Col>
                </Row>

                <Row className="form-group">
                    <Label htmlFor="comment" md={2}>Your Comment</Label>
                    <Col md={10}>
                        <Control.textarea model=".comment" id="comment" name="comment"
                            rows="6"
                            className="form-control" />
                    </Col>
                </Row>

                <Row className="form-group">
                    <Col md={{size:10, offset: 2}}>
                        <Button type="submit" color="primary">
                        Submit
                        </Button>
                    </Col>
                </Row>

              </LocalForm>
            </ModalBody>
        </Modal>

        </div>
      );
    }
}


function RenderComments({comments,addComment,dishId}) {
  if (comments != null)
  {
    var commentList = comments.map(comment => {
        return (
            <div>
                <li key={comment.id} >
                    {comment.comment}
                    <br /><br />
                    -- {comment.author}, {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(new Date(Date.parse(comment.date)))}
                    <br /><br />
                </li>
            </div>


        );
    });

    return (
        <div>
            <h4>Comments</h4>
            <ul className="list-unstyled">

                    {commentList}

            </ul>
              <CommentForm className="mx-auto" dishId={dishId} addComment={addComment} />

        </div>
    );
  }
  else
      return(
          <div></div>
      );

}





function RenderDish({dish}) {
   if (dish != null)
       return(

           <Card>
               <CardImg src={baseUrl + dish.image} alt={dish.name} />
               <CardBody>
                 <CardTitle>{dish.name}</CardTitle>
                 <CardText>{dish.description}</CardText>
               </CardBody>
           </Card>
       );
   else
       return(
           <div></div>
       );
}



const DishDetail = (props) => {
  if (props.isLoading) {
            return(
                <div className="container">
                    <div className="row">
                        <Loading />
                    </div>
                </div>
            );
        }
        else if (props.errMess) {
            return(
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <h4>{props.dishes.errMess}</h4>
                        </div>
                    </div>
                </div>
            );
        }
  else
  {
    return(
      <div className="container">
                  <div className="row">
                      <Breadcrumb>

                          <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                          <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                      </Breadcrumb>
                      <div className="col-12">
                          <h3>{props.dish.name}</h3>
                          <hr />
                      </div>
                  </div>
                  <div className="row">
                      <div className="col-12 col-md-5 m-1">
                          <RenderDish dish={props.dish} />
                      </div>
                      <div className="col-12 col-md-5 m-1">
                      <RenderComments comments={props.comments}
                          addComment={props.addComment}
                          dishId={props.dish.id}
                        />

                      </div>

                  </div>

                  </div>
    );
  }

}



export default DishDetail;
