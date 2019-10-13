import * as React from 'react';
import './app.scss'
import NumbersGrid from "Components/numbersgrid";
import {Container, Grid} from 'semantic-ui-react'

interface IPApp {

}

class App extends React.Component<any, IPApp> {
    render() {
        return (<Container>
            <Grid columns={"equal"}>
                <Grid.Column/>
                <Grid.Column width={8}>
                    <NumbersGrid/>
                </Grid.Column>
                <Grid.Column/>
            </Grid>

        </Container>);
    }
}

export default App;