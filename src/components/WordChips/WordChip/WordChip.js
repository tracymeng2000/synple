import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import * as actionCreators from '../../../store/actions/index';
import { Paper, Icon, List, ListItem, ListItemText, Tooltip } from '@material-ui/core';
import {colors} from '../../../utility/Constants';
import {UnfoldMore} from '@material-ui/icons';
import Aux from '../../../hoc/Aux/Aux';
import {CopyToClipboard} from 'react-copy-to-clipboard';

const styles = {
    card: {
        backgroundColor: colors.white,
        fontWeight: 'bold',
        fontSize: '24px',
        padding: '10px',
        minHeight: '50px',
        textAlign: 'left',
    },
    textSafe: {
        color: colors.ufoGreen,
    },
    textWarning: {
        color: colors.orange,
    },
    textDanger: {
        color: colors.watermelon,
    },
    list: {
        height: '198px',
        boxShadow: 'inset 2px 4px 4px rgba(0, 0, 0, 0.25)',
        overflowY: 'scroll',
        '&:hover':{

        }
    },
    button:{
        float: 'right',

    },
};

class wordChip extends Component {
    state = {
        currentSynonyms : [],
        loaded: false
    }

    getTextClass = () => {
        const classes = this.props.classes;
        if(this.props.frequency <= 2){
            return classes.textSafe;
        }else if(this.props.frequency <= 4){
            return classes.textWarning;
        }else{
            return classes.textDanger;
        }
    }

    getLabel = () => {
        return (this.props.word + '(' + this.props.frequency + ')');
    }


    handleIconClick = (wordOnFocus, index) => {
        this.setState({
            loaded: false
        })
        this.props.toggleTextEditable();
        let toOpen = this.props.indexToExpand === -1 || this.props.indexToExpand !== this.props.index;
        if(toOpen){
            this.props.updateWordOnFocus(wordOnFocus);
            this.props.updateIndexToExpand(index);
            console.log(this.props.synonymList);
            if(this.props.synonymList[this.props.sourceId][wordOnFocus] && 
                this.props.synonymList[this.props.sourceId][wordOnFocus].length > 0){
                console.log('here')
                this.setState({
                    currentSynonyms: this.props.synonymList[this.props.sourceId][wordOnFocus],
                    loaded: true
                })
            }else{
                this.props.getSynonymFromSource(wordOnFocus, this.props.sourceId, (response, error) => {
                    if(response){
                        this.setState({
                            currentSynonyms: response,
                            loaded: true
                        })
                    }
                });
            }
            
        }else{
            this.props.updateWordOnFocus('');
            this.props.updateIndexToExpand(-1);
        }      
    }

    render() {
        const classes = this.props.classes;
        return (
            <Paper
                className={classes.card}
            >   
            <div onClick={() => this.handleIconClick(this.props.word, this.props.index)}>
                <span style={{lineHeight: '50px'}} className={this.getTextClass()}>{this.getLabel()}</span>
                <Icon style={{padding: '13px 0', float: 'right'}}>
                    <UnfoldMore/>
                </Icon>
            </div>
                {
                    this.props.indexToExpand === this.props.index?
                    <div style={{width: '90%', margin: 'auto', marginTop: '10px'}}>
                        {this.state.loaded? <List className={classes.list}>
                            {this.state.currentSynonyms.map((word, index) => (
                                <CopyToClipboard text={word} onCopy={() =>{/*later add logic to show toast*/}}>
                                    <Tooltip title='copy to clipboard'>
                                        <ListItem button key={index}>    
                                            <ListItemText>
                                                {word}
                                            </ListItemText>
                                        </ListItem>
                                    </Tooltip>
                                </CopyToClipboard>
                            ))}
                            
                            </List> : <div> loader placeholder </div>}
                    </div>: null
                }
                {/* <Button>Go to Source</Button> */}
            </Paper>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        textEditable : state.editor.textEditable,
        indexToExpand: state.editor.indexToExpand,
        sourceId: state.synonym.sourceId,
        synonymList: state.synonym.synonymList
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateWordOnFocus: (wordOnFocus) => dispatch(actionCreators.updateWordOnFocus(wordOnFocus)),
        toggleTextEditable: () => dispatch(actionCreators.toggleTextEditable()),
        getSynonymFromSource: (word, sourceId, callback) => dispatch(actionCreators.getSynonymFromSource(word, sourceId, callback)),
        updateIndexToExpand: (updatedIndexToExpand) => dispatch(actionCreators.updateIndexToExpand(updatedIndexToExpand))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(wordChip));