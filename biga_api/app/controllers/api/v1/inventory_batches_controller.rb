class Api::V1::InventoryBatchesController < ApplicationController
  before_action :set_batch, only: [:show, :update, :destroy]

  # GET /api/v1/inventory_batches
  def index
    @batches = InventoryBatch.all.order(expiry_date: :asc)
    render json: @batches
  end

  # GET /api/v1/inventory_batches/1
  def show
    render json: @batch
  end

  # POST /api/v1/inventory_batches
  def create
    @batch = InventoryBatch.new(batch_params)

    if @batch.save
      # Devolvemos el lote con el serializer que creamos
      render json: @batch, status: :created
    else
      render json: { errors: @batch.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/inventory_batches/1
  def update
    if @batch.update(batch_params)
      render json: @batch
    else
      render json: { errors: @batch.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/inventory_batches/1
  def destroy
    if @batch.destroy
      head :no_content
    else
      render json: { error: "No se pudo eliminar el lote" }, status: :error
    end
  end

  private

  def set_batch
    @batch = InventoryBatch.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Lote no encontrado" }, status: :not_found
  end

  def batch_params
    params.require(:inventory_batch).permit(
      :ingredient_id, 
      :quantity, 
      :cost_per_unit, 
      :expiry_date
    )
  end
end