import React, {Component} from 'react';
import {Dialog, FormControlLabel, DialogTitle, DialogContent, DialogActions, Button} from '@material-ui/core';
import {COMPONENT_TYPE, ID, colors} from '../../utility/Constants';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actionTypes';
import BlueSwitch from './renderableComponents/BlueSwitch';


class GeneralDialog extends Component{
    state = {
        caseSensitive: this.props.caseSensitive,
        commonWordFilter: this.props.commonWordFilter,
    }

    componentDidUpdate = (prevProps) => {
        if(prevProps.open !== this.props.open && this.props.open){
            this.setState({
                caseSensitive: this.props.caseSensitive,
                commonWordFilter: this.props.commonWordFilter
            })
        }
    }

    handleClose = () => {
        this.props.updateDialogInfo({open: false, components: []});
    }

    handleChange = (id) => {
        switch(id){
            case(ID.CASE_SENSITIVE):
                this.setState({
                    caseSensitive: !this.state.caseSensitive
                })
                break;
            case(ID.COMMON_WORD):
                this.setState({
                    commonWordFilter: !this.state.commonWordFilter
                })
                break;
            default:
                // console.log(id);
        }
    }

    handleButtonClick = (id) => {
        if(id === ID.APPLY_SETTING){
            this.props.updateCaseSensitiveSetting(this.state.caseSensitive);
            this.handleClose();
        }
    }

    isChecked = (id) => {
        switch(id){
            case(ID.CASE_SENSITIVE):
                return this.state.caseSensitive
            case(ID.COMMON_WORD):
                return this.state.commonWordFilter
            default:
                return false;
        }
    }

    render(){
        const dialogContent = [];
        const dialogActions = [];
        for(let dialogComponentIndex in this.props.dialogInfo.components){
            const component = this.props.dialogInfo.components[dialogComponentIndex];
            switch(component.type){
                case(COMPONENT_TYPE.FORM_CONTROL_LABEL):
                    dialogContent.push(
                        <FormControlLabel
                            style={{display: 'inherit'}}
                            key={dialogComponentIndex}
                            control={
                                <BlueSwitch 
                                checked = {this.isChecked(component.config.id)}
                                onChange={() => this.handleChange(component.config.id)}/>
                            }
                            label={component.config.label}/>
                    )
                    break;
                case(COMPONENT_TYPE.BUTTON):
                    dialogActions.push(
                        <Button 
                            key={dialogComponentIndex}
                            id={component.config.id} 
                            onClick={()=>this.handleButtonClick(component.config.id)}
                            style={{backgroundColor: colors.clearChill, color: colors.white, fontWeight: 'bold'}}>
                            {component.config.label}
                        </Button>
                    )
                    break;
                default:
                    //do nothing
            }

        }

        return(
            <Dialog open={this.props.dialogInfo.open} onClose={this.handleClose}>
                <DialogTitle>
                    {this.props.dialogInfo.dialogTitle}
                </DialogTitle>
                <DialogContent>
                    {dialogContent.map(contentItem => (
                        contentItem
                    ))}
                </DialogContent>
                <DialogActions>
                    {dialogActions.map(actionItem => (
                        actionItem
                    ))}
                </DialogActions>
            </Dialog>
        )
        
    }
}

const mapStateToProps = (state) => {
    return {
        dialogInfo : state.dialogInfo,
        caseSensitive: state.caseSensitive,
        commonWordFilter: state.commonWordFilter
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateDialogInfo: (updatedDialogInfo) => dispatch({ type: actionTypes.UPDATE_DIALOG_INFO, updatedDialogInfo: updatedDialogInfo}),
        updateCaseSensitiveSetting: (caseSensitiveOn) => dispatch({type: actionTypes.TOGGLE_CASE_SENSITIVE, caseSensitiveOn: caseSensitiveOn})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GeneralDialog);