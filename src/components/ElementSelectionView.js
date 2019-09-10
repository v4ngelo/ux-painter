import React from 'react';
import PageSelector from '../PageSelector';
import XPathInterpreter from '../refactorings/XPathInterpreter';
import {goBack, goTo} from 'route-lite';

class ElementSelectionView extends React.Component {

    constructor (props) {
        super(props);
        this.state = {elementXpath: "", errorInSelection: false};
        this.refactoring = this.props.refactoring;
        this.pageSelector = new PageSelector (this);
        this.pageSelector.enableElementSelection({
            "targetElementSelector": this.refactoring.targetElements(),
        });
        this.pageSelector.preventDomElementsBehaviour();

        this.disableElementSelection = this.disableElementSelection.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.handleNext = this.handleNext.bind(this);
    }


    onElementSelected(anElement) {
        if (this.refactoring.getElement()) {
            this.pageSelector.removeSelectionClass(this.refactoring.getElement(), this.pageSelector.selectionClass);
        }
        const elementXpath = (new XPathInterpreter()).getPath(anElement, document.body)[0];
        this.setState({elementXpath: elementXpath});
        this.refactoring.setElementXpath(elementXpath);
        this.refactoring.setElement(anElement);
        this.pageSelector.addSelectionClass(anElement, this.pageSelector.selectionClass);
        const me = this;
    }

    disableElementSelection() {
        this.pageSelector.restoreDomElementsBehaviour();
    }

    handleBack() {
        this.disableElementSelection();
        this.pageSelector.removeSelectedElementsHighlighting();
        goBack();
    }

    handleNext() {
        if (this.state.elementXpath) {
            this.disableElementSelection();
            goTo(this.refactoring.getView(), {"refactoring": this.refactoring});
        }
        else {
            this.setState({errorInSelection:true});
        }
    }

    render () {
        return (
        <div className={"container"}>
            <div className={"row col-12"}>
                <h5 className={"text-center"}>Selection of the target element</h5>
            </div>
            <div className={"row col-12"}>
                <h6>{this.refactoring.constructor.asString()}</h6>
            </div>
            <div className={"row col-12"}>
                <p>Select an element from the page</p>
            </div>
            {this.state.errorInSelection && (
                <div className={"row col-12"}>
                    <p className={'text-danger'}>Element must be selected to continue</p>
                </div>)}
            <div className={'row'}>
                <div className={"col-4"}>
                    <a className={'btn btn-secondary'} onClick={() => this.handleBack()}>Back</a>
                </div>
                <div className={"col-4"}>
                    <a onClick={this.handleNext} className={'btn btn-warning'}>Next</a>
                </div>
            </div>
        </div>

        );
    }


}

export default ElementSelectionView;